import React from "react";
import { Platform, ImageSourcePropType, ImageURISource } from "react-native";
import { useFirebase } from "react-redux-firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export const useImageUpload = (
  onSuccess: () => any,
  onFailure: (e: Error) => any,
  storage: { url: string; name: string },
  storeDocument: { collection: string; id: string; property: string },
  saveOnSelection: boolean = false
) => {
  const [image, setImage] = React.useState<ImageURISource>();
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(false);
  const firebase = useFirebase();

  React.useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const handlePickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        if (saveOnSelection) {
          handleSaveImage({
            uri: result.uri,
            width: 300,
            height: 300,
            scale: 1,
          });
        } else {
          setImage({
            uri: result.uri,
            width: 300,
            height: 300,
            scale: 1,
          });
        }
      }

      console.log(result);
    } catch (E) {
      setTransferred(false);
      setUploading(false);
      console.log(E);
    }
  };

  const getFile = async (uri: string) => {
    if (!uri) return;
    try {
      const result = await fetch(uri);
      const blob = await result.blob();
      return blob;
    } catch (e) {
      console.log(e);
      setTransferred(false);
      setUploading(false);
    }
  };

  const handleSaveImage = async (paramImage?: ImageURISource) => {
    setUploading(true);
    let uri = "";
    if (paramImage && paramImage.uri) {
      uri = paramImage.uri;
    } else if (!image || !image.uri) {
      console.log("no image uploaded");
      setTransferred(false);
      setUploading(false);
      return;
    } else {
      uri = image.uri;
    }
    const blob: Blob | undefined = await getFile(uri);
    if (!blob) {
      console.log("blob retrieval failed");
      setTransferred(false);
      setUploading(false);
      return;
    }
    console.log("saving");
    firebase
      .uploadFile(storage.url, blob, storeDocument.collection, {
        name: storage.name,
        metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
          return { [storeDocument.property]: downloadURL };
        },
        useSetForMetadata: false,
        documentId: storeDocument.id,
      })
      .then(() => {
        setTransferred(true);
        setUploading(false);
        onSuccess();
      })
      .catch((e) => {
        setTransferred(false);
        setUploading(false);
        onFailure(e);
        console.log(e);
      });
  };

  const state: [
    ImageURISource | undefined,
    boolean,
    boolean,
    () => Promise<void>,
    (() => Promise<void>) | null
  ] = [
    image,
    uploading,
    transferred,
    handlePickImage,
    saveOnSelection ? handleSaveImage : null,
  ];

  return state;
};

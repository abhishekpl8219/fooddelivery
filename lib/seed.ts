import * as FileSystem from "expo-file-system";
import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  try {
    const list = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId
    );
    await Promise.all(
      list.documents.map((doc) =>
        databases.deleteDocument(
          appwriteConfig.databaseId,
          collectionId,
          doc.$id
        )
      )
    );
    console.log(`Cleared collection ${collectionId}`);
  } catch (err: any) {
    console.error(`Failed to clear collection ${collectionId}:`, err.message);
  }
}

async function clearStorage(): Promise<void> {
  try {
    const list = await storage.listFiles(appwriteConfig.bucketId);
    await Promise.all(
      list.files.map((file) =>
        storage.deleteFile(appwriteConfig.bucketId, file.$id)
      )
    );
    console.log("Cleared storage bucket");
  } catch (err: any) {
    console.error("Failed to clear storage:", err.message);
  }
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    const filename = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;
    const fileUri =
      (FileSystem.cacheDirectory ?? FileSystem.documentDirectory) + filename;

    const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri);
    const fileInfo = await FileSystem.getInfoAsync(downloadRes.uri);

    if (!fileInfo.exists) throw new Error("File not found after download");

    const fileObj = {
      uri: downloadRes.uri,
      name: filename,
      type: "image/jpeg",
      size: fileInfo.size ?? 0,
    };

    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    // Return valid URL string for collection
    return storage.getFileView(appwriteConfig.bucketId, file.$id).toString();
  } catch (err: any) {
    console.error("Failed to upload image:", imageUrl, err.message);
    return ""; // fallback empty string
  }
}

async function seed(): Promise<void> {
  try {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.categoriesCollectionId,
          ID.unique(),
          cat
        );
        categoryMap[cat.name] = doc.$id;
      } catch (err: any) {
        console.error("Failed to create category:", cat.name, err.message);
      }
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.customizationsCollectionId,
          ID.unique(),
          {
            name: cus.name,
            price: cus.price,
            type: cus.type,
          }
        );
        customizationMap[cus.name] = doc.$id;
      } catch (err: any) {
        console.error("Failed to create customization:", cus.name, err.message);
      }
    }

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      try {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_url: uploadedImage,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            categories: categoryMap[item.category_name],
          }
        );
        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
          try {
            await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.menuCustomizationsCollectionId,
              ID.unique(),
              {
                menu: doc.$id,
                customizations: customizationMap[cusName],
              }
            );
          } catch (err: any) {
            console.error(
              `Failed to create menu_customization for menu ${item.name} and customization ${cusName}:`,
              err.message
            );
          }
        }
      } catch (err: any) {
        console.error("Failed to create menu item:", item.name, err.message);
      }
    }

    console.log("✅ Seeding complete.");
  } catch (err: any) {
    console.error("Seeding process failed:", err.message);
  }
}

export default seed;

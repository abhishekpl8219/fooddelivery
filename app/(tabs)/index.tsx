import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { Fragment } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  const { user } = useAuthStore();
  console.log("user", JSON.stringify(user, null, 2));
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row flex-between  mx-10">
        <View>
          <Text className="small-bold text-primary">DELIVER TO</Text>
          <TouchableOpacity className="flex-row gap-x-1">
            <Text className="paragraph-bold text-dark-100">Delhi</Text>
            <Image
              source={images.arrowDown}
              resizeMode="contain"
              className="size-3"
            />
          </TouchableOpacity>
        </View>
        <View>
          <CartButton />
        </View>
      </View>
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Pressable
                className={
                  index % 2 !== 0
                    ? "offer-card flex-row "
                    : "offer-card flex-row-reverse"
                }
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
              >
                <Fragment>
                  <View className={"h-full w-1/2"}>
                    <Image
                      source={item.image}
                      resizeMode={"contain"}
                      className={"size-full"}
                    />
                  </View>
                  <View
                    className={
                      index % 2 !== 0
                        ? "offer-card__info pr-10"
                        : "offer-card__info  pl-10"
                    }
                  >
                    <Text className="h1-bold  text-white leading-tight">
                      {item.title}
                    </Text>
                    <Image
                      source={images.arrowRight}
                      className="size-10"
                      resizeMode="contain"
                      tintColor="#ffffff"
                    />
                  </View>
                </Fragment>
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
      />
    </SafeAreaView>
  );
}

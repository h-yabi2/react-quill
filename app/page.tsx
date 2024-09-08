import { QuillRefProvider } from "../context/QuillRefContext";
import MyComponent from "@/app/components/MyComponent";
import Component02 from "./components/Component02";
import Component03 from "./components/Component03";
import Component04 from "./components/Component04";
import Component05 from "./components/Component05";
import Component06 from "./components/Component06";
import Component07 from "./components/Component07";
import Component08 from "./components/Component08";
import CustomShortcut from "./components/CustomShortcut";

export default function Home() {
  return (
    <QuillRefProvider>
      <main className="">
        {/* <MyComponent /> */}
        {/* <Component02 /> */}
        {/* <Component03 /> */}
        {/* <Component04 /> */}
        {/* <Component05 /> */}
        {/* <Component06 /> */}
        {/* <Component07 /> */}
        {/* <Component08 /> */}
        <CustomShortcut />
        {/* test */}
      </main>
    </QuillRefProvider>
  );
}

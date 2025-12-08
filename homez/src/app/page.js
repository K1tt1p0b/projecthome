//import Home_V1 from "./(home)/home-v1/page";
import Home_V10 from "./(home)/home-v10/page";
import Wrapper from "./layout-wrapper/wrapper";

export const metadata = {
  title: "Home v10 || Homez - Real Estate NextJS Template",
};

export default function MainRoot() {
  return (
    <Wrapper>
      <Home_V10 />
    </Wrapper>
  );
}

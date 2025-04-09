import { Feather } from "@expo/vector-icons";

type IconProps = {
  color?: string;
};

export const iconMap: Record<string, (props: IconProps) => JSX.Element> = {
  "(index)": (props) => (
    <Feather name="home" size={24} color="#222" {...props} />
  ),
  "(add)": (props) => (
    <Feather name="plus-circle" size={24} color="#222" {...props} />
  ),
  "(profile)": (props) => (
    <Feather name="user" size={24} color="#222" {...props} />
  ),
  // "(new)/index": (props) => (
  //   <Feather name="navigation" size={24} color="#222" {...props} />
  // ),
};

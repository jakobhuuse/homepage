import Image from "next/image";

export default function About() {
  return (
    <Image
      src={"/skeletron.jpg"}
      width={500}
      height={500}
      alt="Epic Skeleton!"
    />
  );
}

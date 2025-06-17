import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

type GameProfileProps = {
  name: string;
  image?: string;
  rating?: number;
};

export default function GameProfile({ name, image, rating }: GameProfileProps) {
  return (
    <div className="flex flex-row items-center gap-3">
      <Avatar>
        <AvatarImage src={image} alt="Avatar image" />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p>{name}</p>
        <Badge variant="default" className="w-full">
          {rating !== undefined ? rating : "N/A"}
        </Badge>
      </div>
    </div>
  );
}

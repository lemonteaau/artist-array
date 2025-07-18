import Image from "next/image";

interface PromptImageProps {
  imageUrl: string;
  artistString: string;
}

export function PromptImage({ imageUrl, artistString }: PromptImageProps) {
  return (
    <div>
      <Image
        src={imageUrl}
        alt={artistString}
        width={1024}
        height={1024}
        className="rounded-lg object-contain"
        priority
      />
    </div>
  );
}

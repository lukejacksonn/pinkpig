interface Props {
  name?: string;
  src?: string;
  className?: string;
}

export const FileInputPreview = (props: Props) => {
  const { name, src, ...rest } = props;
  return (
    <div {...rest}>
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={
          src ??
          "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        }
      />
      <input
        name={name}
        type="file"
        id="banner"
        required
        className="absolute inset-0 w-full h-full opacity-0"
        onInput={(event) => {
          const target = event.target as HTMLInputElement;
          if (!target.files) return;
          const file = target.files[0];
          const reader = new FileReader();
          reader.onload = function () {
            const imageData = reader.result as string;
            const imgElement =
              target.previousElementSibling as HTMLImageElement;
            if (!imgElement) return;
            imgElement.src = imageData;
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
};

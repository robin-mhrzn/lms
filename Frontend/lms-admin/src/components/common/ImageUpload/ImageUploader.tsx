import { Upload, Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utils/commonUtil";

interface ImageUploaderProps {
  onChange: (file: RcFile) => void;
  fileUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, fileUrl }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    const newFilrUrl = getImageUrl(fileUrl);
    setImageUrl(newFilrUrl ?? "");
  }, [fileUrl]);
  function handleChange(info: any) {
    if (info.file) {
      onChange(info.file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(info.file);
    }
  }

  return (
    <div>
      <Upload
        maxCount={1}
        beforeUpload={() => {
          return false;
        }}
        onChange={handleChange}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Select Image</Button>
      </Upload>
      {imageUrl && (
        <div style={{ marginTop: 10 }}>
          <Image
            width={100}
            src={imageUrl}
            alt="Image preview"
            preview={false}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

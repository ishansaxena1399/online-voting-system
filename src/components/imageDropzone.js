import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";

export default function ImageDropzone({ updateFile, previewImg }) {
  const [previewFile, setPreviewFile] = useState(previewImg);

  const {
    getRootProps,
    getInputProps,
    open,
    fileRejections
  } = useDropzone({
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5, // 5MB
    accept: "image/*",
    onDrop: acceptedFiles => {
      updateFile(acceptedFiles[0]);
      setPreviewFile(URL.createObjectURL(acceptedFiles[0]));
    },
    noClick: true
  });

  const FilePreview = () => <img className="previewImage" src={previewFile} />;

  const rejectedFiles = fileRejections.map(({ file, errors }) => {
    return (
      <>
        {
          errors[0].code === "file-too-large" &&
          <p className="errorText" >
            File size should be less than 5MB
          </p>
        }
      </>
    )
  });

  useEffect(() => {
    if (previewImg) setPreviewFile(previewImg);
  }, [previewImg]);

  return (
    <>
      <section className="text-center" >
        {
          !previewFile &&
          <div {...getRootProps({ className: 'dropzone h-48 mb-2 text-center flex items-center justify-center border-dashed border-2 border-indigo-600 dark:border-slate-100 dark:text-white cursor-disabled' })}>
            <p>Selected Image will be visible here</p>
          </div>
        }
        <div className="flex justify-center flex-col items-center" >
          <FilePreview />
          <div {...getRootProps()} >
            <input {...getInputProps()} />
            <Button
              type="button"
              onClick={open}
              className="addUserButton"
              variant="outlined"
            >
              {!previewFile ? "Add Image" : "Change"}
            </Button>
          </div>
        </div>
        <div className="mt-2" >
          {rejectedFiles}
        </div>
      </section>
    </>
  );
}
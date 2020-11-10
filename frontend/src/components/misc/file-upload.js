import React, { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import Button from "@material-ui/core/Button";
import Axios from "axios";

export default function MyDropzone(props) {
  const [Images, setImages] = useState([]);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
        header: { 'content-type': 'multipart/form-data' } ,   
    }
     
    formData.append("file", files[0])
    console.log("before upload call ");
    console.log(formData);
    Axios.post('http://localhost:4000/listings/upload', formData, config)
        .then(response => {
            if (response.data) {
                setImages([...Images, response.data.image])
                props.refreshFunction([...Images, response.data.image])

            } else {
                alert('fail')
            }
        })
}
  //const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
 
  const onDelete = (image) => {
    const currentIndex = Images.indexOf(image);

    let newImages = [...Images];
    newImages.splice(currentIndex, 1);

    setImages(newImages);
    props.refreshFunction(newImages);
  };

  return (
    <div className={props.className}>
      <Dropzone onDrop={onDrop} maxSize={9999999999} multiple ={false}>
        {({ getRootProps, getInputProps }) => (
         
            <div {...getRootProps()}
            >
                {console.log('getRootProps', { ...getRootProps() })}
                {console.log('getInputProps', { ...getInputProps() })}
                <input {...getInputProps()} />
                <Button variant="outlined">Upload Image</Button>

            </div>
          //https://react-dropzone.js.org/ Has Material UI stuff
        )}
      </Dropzone>
      <div
        style={{
          display: "flex",
          height: "100px",
          overflowX: "scroll",
        }}
      >
        {console.log(Images)}
        {Images.map((image, index) => (
                    <div onClick={() => onDelete(image)}>
                      {console.log(Images)}
                        <img 
                        style={{ minWidth: '1px', width: '300px', height: '240px' }} src={` ${image}`} alt={`productImg-${index}`}>
                        </img>
                    </div>
                ))}
      </div>
    </div>
  );
}

/*
<Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)} multiple>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Button variant="outlined">Upload Image</Button>
                    </div>
                  </section> //https://react-dropzone.js.org/ Has Material UI stuff
                )}
</Dropzone>
*/

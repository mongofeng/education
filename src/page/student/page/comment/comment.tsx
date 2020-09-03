import { Button, DatePicker, Input, message, Modal, Tag, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import * as React from "react";
import { accessTokenName } from "../../../../utils/http";



const { useState } = React;
const { TextArea } = Input;

const confirm = Modal.confirm;


const uploadButton = (
  <div>
    <div className="ant-upload-text">上传</div>
  </div>
);


function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

interface IProps {
  id: string
}




const List: React.FC<IProps> = (props) => {

  const [
    fileList,
    setFileList
  ] = useState([
    // {
    //   uid: '-2',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-3',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-4',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // },
    // {
    //   uid: '-5',
    //   name: 'image.png',
    //   status: 'error',
    // },
  ] as UploadFile[])


  const [
    previewVisible,
    setPreviewVisible
  ] = useState(false)



  const [
    previewTitle,
    setPreviewTitle
  ] = useState('')


  const [
    previewImage,
    setPreviewImage
  ] = useState('')


  const [
    value,
    setValue
  ] = useState('')


  const handleCancel = () => setPreviewVisible(false);
  // 点击预览时候
  const handlePreview = async (file: any) => {

    console.log(file, 'test')
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);

    setPreviewVisible(true)

    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))


  };

  // 上传后的图片
  const handleChange = ({ fileList }) => {
    console.log('filtList', fileList)
    setFileList([...fileList])
  };


  const onChange = ({ target: { value } }) => {
    setValue(value)
  };


  const localStorageAccessTokenName = window.localStorage.getItem(
    accessTokenName
  );

  const headers = {
    [accessTokenName]: localStorageAccessTokenName
  }


  return (

    <div>
      <div className="main-title clearfix">
        <h2>课程评论列表</h2>
      </div>
      <div className="content-wrap">
        
      <Upload
        action="/v2/upload/image"
        listType="picture-card"
        fileList={fileList}
        headers={headers}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>


      <TextArea
        value={value}
        onChange={onChange}
        placeholder="课程的评论"
        autosize={{ minRows: 15 }}
      />


      <Button type="primary">提交</Button>
    </div>

    </div>
  );
}

export default List;

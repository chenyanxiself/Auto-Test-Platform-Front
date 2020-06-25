import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadProjectImgApi,delProjectImgApi } from '../../api/index'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
    };
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      const fileUid = file.uid
      let targetFileInFileList = fileList.find(file => file.uid === fileUid)
      targetFileInFileList.name = file.response.data.fileName
      targetFileInFileList.url = file.response.data.url
      this.props.onChange(targetFileInFileList.url)
      message.success('上传图片成功')
    } else if (file.status === 'error') {
      this.setState({fileList:[]})
      message.error('上传图片失败')
    }
    this.setState({ fileList })
  };

  handleRemove = async (file) => {
    const res = await delProjectImgApi(file.name)
    if(res.status===1){
      message.success('删除图片成功')
      this.setState({
        fileList: []
      })
      this.props.onChange(null)
      return true
    }else{
      message.error('删除图片失败: '+res.error)
      return false
    }
  }
  onCustomRequest = async (file) => {
    const res = await uploadProjectImgApi(file)
    if (res.status === 1) {
      file.onSuccess(res)
    } else {
      file.onError()
    }
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept='image/*'    //只能接受图片,设置接受的文件属性
          customRequest={this.onCustomRequest}
          listType="picture-card"
          name='projectImg'   //后台接受文件的参数名
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
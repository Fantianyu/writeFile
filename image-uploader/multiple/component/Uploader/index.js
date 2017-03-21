/**
 * Created by fantianyu on 17/1/3.
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"
import Upload from "rc-upload"
import {BASE_HOST} from "env"
import message from "antd/lib/message"

import "../../style.less"

const clsPrefix = "cms-multiple-uploader"
export default class MultipleImage extends PureComponent {

  constructor(props) {
    super(props)
  }

  /**
   * 上传成功后的回调函数
   * @param result 文件相关
   */
  onSuccess = (result) => {
    const {onChange, hasInput, forGame} = this.props
    let dataItem = hasInput
      ?
    {
      cover: result.data.path,
      metaFileName: result.data.metaFileName
    }
      : (
      forGame
        ?
        result.data.path
        :
      {
        cover: result.data.path
      }
    )
    if (onChange)onChange(dataItem)
  }


  /**
   * 只能上传200k的图片
   * @param file
   * @returns {boolean}
   */
  beforeUpload=(file) => {
    const uploadSize = this.props.uploadSizeLimit || 200
    if (file.size>uploadSize*1024) {
      message.error(`图片大小不能超过${uploadSize}k`)
      return false
    }
  }

  //上传基础配置
  options() {
    const {path, action} = this.props
    let data = {path}
    return {
      name: "src",
      action: action || `${BASE_HOST}/tycms/rest/file/upload`,
      data,
      mulitple: true
    }
  }

  containerStyle() {
    const {containerWidth, containerHeight} = this.props
    return {style: {width: `${containerWidth || 120}px`, height: `${containerHeight || 130}px`}}
  }

  render() {
    return (
      <div className={`${clsPrefix}`} {...this.containerStyle()}>
        <div className={"ant-btn ant-btn-primary"}>
          <Upload {...this.options()}
                  onSuccess={this.onSuccess}
                  component="div"
                  beforeUpload={this.beforeUpload}
          >
            本地上传
          </Upload>
        </div>
        <div className={"ant-btn ant-btn-primary btn-picture-choose"} disabled="disabled">图库选择</div>
      </div>
    )
  }

  static PropTypes = {
    /**
     * 外部容器框的宽度
     */
    containerWidth: React.PropTypes.string,
    /**
     * 外不容器框的高度
     */
    containerHeight: React.PropTypes.string,
    /**
     * 存储上传图片路径的数组，用于传值以及预览图片
     */
    onChange: React.PropTypes.func,
    /**
     * 上传图片的接口地址
     */
    action: React.PropTypes.string,
    /**
     * 上传的标记什么的= =
     */
    path: React.PropTypes.string,
    /**
     * 判断是否是有输入框的上传
     */
    hasInput: React.PropTypes.bool,
    /**
     * 是否用于游戏
     */
    forGame: React.PropTypes.bool
  }
}
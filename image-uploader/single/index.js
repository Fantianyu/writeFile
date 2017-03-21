/**
 * Created by fantianyu on 16/12/26.
 * 单个图片上传
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"
import Upload from "rc-upload"
import {IMAGE_HOST, REST} from "env"

import message from "antd/lib/message"

import "./style.less"

const clsPrefix = "cms-single-uploader"
export default class SingleImage extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || "", //上传完成后的图片路径,显示图片用,
      categoryId: props.categoryId||1, //对应图片素材库的Id
      verticalArrange: props.verticalArrange || false, //是否纵向排列
      previewLabel: props.previewLabel||"750*320",
    }
  }

  /**
   * 上传成功时的方法
   * @param result 获取的文件属性
   */
  onSuccess = (result) => {
    const {onChange} = this.props
    if (onChange)onChange(result.data.path)
    this.setState({
      value: result.data.path
    })
  }

  beforeUpload=(file) => {
    const uploadSize = this.props.uploadSizeLimit || 200
    if (file.size>uploadSize*1024) {
      message.error(`图片大小不能超过${uploadSize}k`)
      return false
    }
  }

  //上传基础配置
  options() {
    const {action, path} = this.props
    let data = {path}
    return {
      name: "src",
      action: action||`${REST}/file/upload`,
      data
    }
  }

  //预览图片容器的宽高
  previewStyle() {
    const {previewWidth, previewHeight} = this.props
    return {style: {width: `${previewWidth||114}px`, height: `${previewHeight}px`}}
  }
  //当预览和按钮是上下排列时，按钮容器的宽度必须预览图片的宽度一样宽
  buttonStyle() {
    const {previewWidth} = this.props
    return this.state.verticalArrange?{style: {width: `${previewWidth||114}px`}}:""
  }

  render() {
    return (
      <div className={this.state.verticalArrange ?  "cms-single-uploader-vertical":"cms-single-uploader-horizontal"}>
        <div {...this.previewStyle()} className={`${clsPrefix}-preview`}>
          <div className={this.state.value ? `${clsPrefix}-preview-container` : "cms-hide-block"}>
            <img src={`${IMAGE_HOST}${this.state.value}`}/>
          </div>
          <div className={this.state.value ? "cms-hide-block" : `${clsPrefix}-preview-label`}>
            <p>图片建议尺寸{this.state.previewLabel}</p>
          </div>
        </div>
        <div {...this.buttonStyle()} className={`${clsPrefix}-uploaderbutton`}>
          <div className={"ant-btn ant-btn-primary cms-fe-uploader"}>
            <Upload ref="inner"
                    {...this.options()}
                    component="div"
                    onSuccess={this.onSuccess}
                    onStart={this.onStart}
                    beforeUpload={this.beforeUpload}
            >
              本地上传
            </Upload>
          </div>
          <div className={"ant-btn ant-btn-primary btn-picture-choose cms-fe-uploader"} disabled="disabled">
            图库选择
          </div>
        </div>
      </div>
    )
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value || ""
    })
  }

  static propTypes = {
    /**
     * 上传的识别路径,如game.cover.src
     */
    path: React.PropTypes.string.isRequired,
    /**
     * 发起请求的地址
     */
    action: React.PropTypes.string,
    /**
     * 获取返回的数据地址的方法
     */
    onChange: React.PropTypes.func,
    /**
     * 图片预览的宽度
     */
    previewWidth: React.PropTypes.string,
    /**
     * 图片预览的高度
     */
    previewHeight: React.PropTypes.string,
    /**
     * 图片预览上的文字
     */
    previewLabel: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    /**
     * 排列模式，true时按钮和图片语言是上下排列，false时按钮和图片预览是左右排列 这个可以大家一起商量下怎么确定好
     */
    verticalArrange: React.PropTypes.bool,
    /**
     * 对应图片库的分类id
     */
    categoryId: React.PropTypes.number,

    uploadSizeLimit: React.PropTypes.number,
    /**
     * 图片限制大小（kb）
     */
  }
}
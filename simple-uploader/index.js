/**
 * Created by fantianyu on 16/12/23.
 * 文件上传
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"
import Upload from "rc-upload"

import "./style.less"
import {BASE_HOST} from "env"

const clsPrefix = "cms-simple-uploader"
export default class SimpleUploader extends PureComponent {


  constructor(props) {
    super(props)
    this.state = {
      value: props.value|| "", //上传完成后显示的文件路径
      uploadState: "", //上传进度百分比
      showCancel: false//是否显示取消按钮
    }
  }

  /**
   * 开始上传时方法，显示取消按钮
   * @param file
   */
  onStart = () => {
    this.setState({
      showCancel: true
    })
  }
  /**
   * 上传的过程中的方法，用于显示上传进度
   * @param step 上传的过程
   * @param file 上传的文件
   */
  onProgress = (step) => {
    this.setState({
      uploadState: `${Math.round(step.percent)}%`
    })
  }

  /**
   * 取消上传
   */
  onAbort = () => {
    this.refs.inner.abort()
    this.setState({
      showCancel: false,
      uploadState: ""
    })
  }

  /**
   * 上传成功时的方法
   * @param result 获取的文件属性
   */
  onSuccess = (result) => {
    const {onChange, onUploadComplete, completeData} = this.props
    if (onUploadComplete)onUploadComplete(this.props.model, result.data)
    if (onChange)onChange(completeData ? result.data : result.data.path)
    this.setState({
      value: result.data.path,
      uploadState: "完成",
      showCancel: false
    })
  }


  //上传基础配置
  options() {
    const {action, path} = this.props
    return {
      name: "src",
      action: action||`${BASE_HOST}/tycms/rest/file/upload`,
      data: {path},
      multiple: true
    }
  }

  containerStyle() {
    const {containerWidth} = this.props
    return { style: {width: `${ containerWidth || 652 }px`} }
  }

  inputStyle() {
    const {inputWidth} = this.props
    return { style: {width: `${ inputWidth || 440 }px`} }
  }

  //修改上传的路径的
  inputOnchange=(e) => {
    const {onChange} =this.props
    if (onChange)onChange(e.target.value)
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <div className={`${clsPrefix}`} {...this.containerStyle()}>
        <div className={this.props.isMultiple?"btn-hide":`${clsPrefix}-tip`}>
          <div className={`${clsPrefix}-tip-input`}>
            <input type="text" onChange={this.inputOnchange} value={this.state.value} {...this.inputStyle()}/>
          </div>
        </div>
        <div className={ !this.state.showCancel ? "ant-btn ant-btn-primary" : "btn-hide"}>
          <Upload ref="inner"
                  {...this.options()} component="div"
                  onProgress={this.onProgress} onSuccess={this.onSuccess}
                  onStart={this.onStart}
          >
            {this.props.buttonText || "文件上传"}
          </Upload>
        </div>
        <div className={ this.state.showCancel ? "ant-btn ant-btn-primary btn-cancel" : "btn-hide"} onClick={this.onAbort}>取消</div>
        <span style={{marginLeft: "10px"}}>
          {this.state.uploadState !== "" ? `已上传${this.state.uploadState}` : ""}
        </span>
      </div>
    )
  }

  /**
   * 如果是编辑，会传一个已上传的文件过来，新增则什么都不用传，直接是空地址
   * @param props
   */
  componentWillReceiveProps(props) {
    this.setState({
      value: props.value || ""
    })
  }

  static propTypes = {
    /**
     * 上传路径
     */
    path: React.PropTypes.string,
    /**
     * 上传服务接口URL
     */
    action: React.PropTypes.string,
    /**
     * 获取上传文件路径的方法
     */
    onChange: React.PropTypes.func,
    /**
     * 已上传文件显示的地址
     */
    value: React.PropTypes.string,
    /***
     * 按钮上的文字
     */
    buttonText: React.PropTypes.string,
    /**
     *控制组件容器的宽度
     */
    containerWidth: React.PropTypes.string,
    /**
     * 控制显示文件路径的宽度
     */
    inputWidth: React.PropTypes.string,
    /**
     * 是否用于音乐批量上传
     */
    isMultiple: React.PropTypes.bool,
  }

}
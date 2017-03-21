/**
 * Created by fantianyu on 16/12/30.
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"
import {IMAGE_HOST} from "env"

import "../../style.less"

const clsPrefix = "cms-preview-input"
export default class PreviewInput extends PureComponent {

  constructor(props) {
    super(props)


    this.state = {
      value: props.cover || "", //预览图片的路径
      metaFileName: props.metaFileName || "默认标题", //图片上面的黑框标题,
      title: props.title||"" //输入框里的值
    }
  }

  //获取图片输入文字的方法
  handleChange = (value) => {
    const {onTitleChange, index} = this.props
    if (onTitleChange)onTitleChange(value, index)
    // this.setState({
    //   title:value
    // })
  }

  /**
   * 设置图片最外部容器的宽度
   * @returns {{style: {width: string}}}
   */
  containerStyle() {
    const {containerWidth, containerHeight} = this.props
    return {style: {width: `${containerWidth||120}px`, height: `${containerHeight||130}px`}}
  }

  /**
   * 将当前图片的下标传到父组件吗，删除图片
   */
  sendIndex() {
    const {onDelete, index} = this.props
    if (onDelete)onDelete(index)
  }


  render() {

    const {value, metaFileName, title } = this.state

    return (
      <div className={`${clsPrefix}`} {...this.containerStyle()}>
        <div className={`${clsPrefix}-picture`}>
          <div className={`${clsPrefix}-picture-label`}
               title={metaFileName}>{metaFileName}</div>
          <img src={`${IMAGE_HOST}${value}`}/>
        </div>
        <div className={`${clsPrefix}-input`}>
          <input type="text" maxLength="8" value={title} onChange={(e) => {
            this.handleChange(e.target.value)
          }}/>
        </div>
        <div className={`${clsPrefix}-delete`} onClick={() => this.sendIndex()}>
          ×
        </div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.cover||"",
      metaFileName: nextProps.metaFileName || "默认标题", //图片上面的黑框标题
      title: nextProps.title||"" //输入框里的值
    })
  }

  static propTypes = {
    /**
     * 获取图片输入的文字的方法
     */
    metaNameOnChange: React.PropTypes.func,
    /**
     * 预览图片的路径
     */
    value: React.PropTypes.Object,
    /**
     * 黑框里的图片标题
     */
    metaFileName: React.PropTypes.string,
    /**
     * 图片下面的输入标题
     */
    title: React.PropTypes.string,
    /**
     * 还是外部容器框的宽度
     */
    containerWidth: React.PropTypes.string,
    /**
     * 外部容器框的高度
     */
    containerHeight: React.PropTypes.string,
    /**
     * 当前图片的下标，用于删除预览图片用
     */
    pictureIndex: React.PropTypes.number,
    /**
     * 删除图片的方法,需要当前图片的数组下标传到父组件
     */
    deletePicture: React.PropTypes.func,

    //
    onTitleChange: React.PropTypes.func


  }
}
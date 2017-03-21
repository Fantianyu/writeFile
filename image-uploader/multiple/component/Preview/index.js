/**
 * Created by fantianyu on 17/1/3.
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"
import {IMAGE_HOST} from "env"

import "../../style.less"

const clsPrefix = "cms-preview"
export default class Preview extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value || "", //显示图片的路径
    }
  }

  /**
   * 将当前图片的下标传到父组件吗，删除图片
   */
  sendIndex() {
    const {onDelete, index} = this.props
    if (onDelete)onDelete(index)
  }

  containerStyle() {
    const {itemWidth, itemHeight} = this.props
    return {style: {width: `${itemWidth || 120}px`, height: `${itemHeight || 130}px`}}
  }

  render() {
    return (
      <div className={`${clsPrefix}`} {...this.containerStyle()}>
        <img src={`${IMAGE_HOST}${this.state.value}`}/>
        <div className={`${clsPrefix}-delete`} onClick={() => {
          this.sendIndex()
        }}>
          ×
        </div>
      </div>
    )
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value||""
    })
  }

  static PropTypes = {
    /**
     * 预览图片的完整路径
     */
    value: React.PropTypes.string,
    /**
     * 还是外部容器框的宽度
     */
    containerWidth: React.PropTypes.string,
    /**
     * 外不容器框的高度
     */
    containerHeight: React.PropTypes.string,
    /**
     * 当前图片的下标，用于删除预览图片用
     */
    pictureIndex: React.PropTypes.number,
    /**
     * 删除图片的方法,需要当前图片的数组下标传到父组件
     */
    onDelete: React.PropTypes.func,
  }
}
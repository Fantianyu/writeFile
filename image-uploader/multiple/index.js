/**
 * Created by fantianyu on 16/12/30.
 */
import React from "react"
import PureComponent from "ftui/components/PureComponent"

import PreviewInput from "./component/PreviewInput"
import Preview from "./component/Preview"
import MultipleUploader from "./component/Uploader"

import "./style.less"

import {BASE_HOST} from "env"

export default class MultipleImage extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      size: props.size || 3,
      images: props.value || [], //图片显示路径的数组，用于预览收集数据用,
    }
  }

  /**
   * 新增图片用的
   * @param value
   */
  onChange = (value) => {
    const newValue = this.state.images.concat(value)
    const {hasInput, onChange} = this.props
    if (hasInput === false) {
      if (onChange)onChange(newValue)
    }
    this.setState({
      images: newValue
    })
  }

  /**
   * 删除图片的方法
   * @param index 点击的图片的数组下标
   */
  onDelete = (index) => {
    const {onChange} = this.props
    const newValue = this.state.images.filter((i, idx) => idx !== index)
    if (onChange)onChange(newValue)
    this.setState({
      images: newValue
    })
  }

  containerStyle() {
    const {containerWidth, containerHeight}= this.props
    return {
      style: {width: `${containerWidth || 600}px`, height: `${containerHeight || 132}px`}
    }
  }

  /***
   * 文本宽里的内容新增或者修改的方法，将所有角色信息传出去
   * @param title 文本内容
   * @param index 角色所对应的数组下标
   */
  onTitleChange = (title, index) => {
    const {onChange} = this.props
    const newImages = this.state.images.map((i, idx) => index === idx ? Object.assign(i, {title}) : i)
    this.setState({images: newImages})
    if (onChange)onChange(this.state.images)
  }


  render() {
    const {images} = this.state
    return (
      <div>
        <div className="cms-multiple-container" {...this.containerStyle()}>

          {images && images.map((item, index) => this.getPreview(item, index))}
          { this.getUploader() }
        </div>
        <div>{`建议图片尺寸${this.props.previewLabel}`}</div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      images: nextProps.value || []
    })
  }

  getUploader() {
    const {images, size} = this.state
    const {itemWidth, itemHeight, action, path, hasInput, forGame} = this.props
    const setting = {
      itemWidth,
      itemHeight
    }
    return images.length >= size
      ? undefined :
      <MultipleUploader
        uploadSizeLimit={ this.props.uploadSizeLimit }
        {...setting}
        action={action || `${BASE_HOST}/tycms/rest/file/upload`}
        path={path}
        onChange={(value) => {
          this.onChange(value)
        }}
        hasInput={hasInput}
        forGame={forGame}

      />
  }

  /**
   * 图片预览
   * @param item 每一项图片的属性值等
   * @param index 下标
   * @returns {XML}
   */
  getPreview(item, index) {
    const {itemWidth, itemHeight, hasInput, forGame} = this.props
    const setting = {
      key: `${index}`,
      index,
      onDelete: this.onDelete,
      itemWidth,
      itemHeight
    }
    return (
      hasInput
        ?
        <PreviewInput
          {...setting}
          {...item}
          onTitleChange={this.onTitleChange}
        />
        : (
        forGame
          ?
          <Preview
            {...setting}
            value={item}
          />
          :
          <Preview
            {...setting}
            value={item.cover}
          />
      )
    )
  }

  static propTypes = {
    /**
     * 外层大容器的宽度
     */
    containerWidth: React.PropTypes.string,
    /**
     * 外层大容器的高度
     */
    containerHeight: React.PropTypes.string,
    /**
     * 里层预览上传组件的宽度
     */
    itemWidth: React.PropTypes.string,
    /**
     * 里层预览上传组件的高度
     */
    itemHeight: React.PropTypes.string,
    /**
     * 是否有输入框
     */
    hasInput: React.PropTypes.bool,
    /**
     * 存储的图片路径数组的长度
     */
    size: React.PropTypes.number,
    /**
     * 上传图片的接口地址
     */
    action: React.PropTypes.string,
    /**
     * 上传的标记什么的= =
     */
    path: React.PropTypes.string,
    /**
     * 角色输入框里的内容
     */
    title: React.PropTypes.string,
    /**
     * 是否用于游戏
     */
    forGame: React.PropTypes.bool
  }
}
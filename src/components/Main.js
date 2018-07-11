require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');//获取图片数据
//获取图片的地址
imageDatas = (function getImageURL (imageDataArr) {
  for(var i = 0,j = imageDataArr.length; i < j; i++) {
    var signleImageData = imageDataArr[i];
    signleImageData.imageURL = require('../images/' + signleImageData.fileName);
    imageDataArr[i] = signleImageData;
  }
  return imageDataArr;
})(imageDatas);

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    var styleObj = {};
    //如果props中指定了图片的属性
    if(this.props.arrange) {
      styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate) {
      (['Moz','ms','Webkit',''].forEach(function(value) {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this)));
    }
    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2>{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

function getRangeRandom (low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30之间的一个任意正负值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30));
}

//控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handlerClick = this.handlerClick.bind(this);
  }
  handlerClick (e) {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    var controllerUnitClassName = 'controller-unit';
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      if(this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handlerClick}></span>
    )
  }
}
class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0,0],
        rightSecx:[0,0],
        y: [0,0]
      },
      vPosRange: { //垂直方向的取值范围
        x: [0,0],
        topY: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: []
    }
    this.reArrange = this.reArrange.bind(this);
    this.inverse = this.inverse.bind(this);
    this.center = this.center.bind(this);
  }

  //翻转图片
  /**
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index
   * @return {function} 这是一个闭包函数，其内return是一个真正待执行的函数
   */
  inverse(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      //更新视图
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  }

  /**
   * 利用reArrange函数，居中对应index的图片
   * @param index， 需要被居中的图片对应的图片信息数组的index
   * @return {function}
   */
  center(index) {
    return function () {
      this.reArrange(index);
    }.bind(this);
  }

  //重新布局所有图片  param：centerIndex指定居中排布哪个图片
  reArrange(centerIndex) {
    //首先拿到取值范围
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecx,
        hPosRangeY = hPosRange.y,
        vPosRangeX = vPosRange.x,
        vPosRangeTopY = vPosRange.topY,

        imgsArrangeTopArr = [],//上侧区域的
        topImgNum = Math.floor(Math.random() * 2),//[0,1]中选取一个或不取
        topImgSpliceIndex = 0,//用来存储上侧的index
        
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//取出居中的图片
        imgsArrangeCenterArr[0]= {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };
        //取出要布局上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index) {
          imgsArrangeTopArr[index] = {
            pos: {
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
              top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        });

        //布局左右图片
        for(var i = 0,len = imgsArrangeArr.length,k = len /2; i < len; i++) {
          var hPosRangeLORX = null;
          //前半部分布局左边，后半部分布局右边
          if(i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          }else {
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos: {
              left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          }
        }
        
        //把之前截取出来的塞回去
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        
        //更新state
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });

  }

  componentDidMount() {
    //首先拿到舞台的大小
    var stage = ReactDOM.findDOMNode(this.refs.stage);
    var stageW = stage.scrollWidth;
    var stageH = stage.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);
    //获取imageFigure的大小
    var imageFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    var imgW = imageFigureDOM.scrollWidth,
        imgH = imageFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW /2),
        halfImgH = Math.ceil(imgH /2);
    //计算中心图片的位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    //计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = - halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上册区域图片的范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.reArrange(0);
  }

  render() {
    var controllerUnits = [];
    var imgFigures = [];
    imageDatas.forEach(function(val,index) {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
            pos:{
              left: 0,
              top: 0
            },
            rotate: 0,
            isInverse: false,
            isCenter: false
          }
      }
      imgFigures.push(<ImgFigure data={val} key={index} inverse={this.inverse(index)} center={this.center(index)} arrange={this.state.imgsArrangeArr[index]} ref={'imgFigure' + index} />)
      controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} key={index} />)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
        {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

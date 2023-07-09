import PropTypes from 'prop-types';
import { useState, useEffect, useRef, Fragment } from 'react';

import { connect } from 'react-redux';
import { userFileUpload } from '../actions/user.actions';
import { FileModel } from '../models';


function ImageUploader(props) {
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  
  const onChangeFile = async (e) => {
    e.preventDefault();
    let res = await props.processFileUpload(
      e.target.files[0], true, '', props.resize? props.resize: null
    );
    if(res){
      if(props.isMultiple) res = [ ...images, res ];
      props.onChangeImage(res);
    }
    if(inputRef && inputRef.current) inputRef.current.value = '';
  };
  const onReorderFile = (e, i, o) => {
    e.preventDefault();
    let n = i + o;
    if(n > -1 && n < images.length){
      let temp = [ ...images ];
      [ temp[i], temp[n] ] = [ temp[n], temp[i] ];
      props.onChangeImage(temp);
    }
  };
  const onFileDelete = (e) => {
    e.preventDefault();
    if(selectedData !== null && selectedData.path){
      if(props.isMultiple){
        let temp = [];
        [ ...images ].forEach(d => {
          if(d && d.path !== selectedData.path) temp.push(new FileModel(d));
        });
        props.onChangeImage(temp);
      }else{
        props.onChangeImage(new FileModel({}));
      }
    }
    onModalProcess();
  };

  const isAddable = () => {
    let temp = true;
    if(!props.isMultiple){
      images.forEach(d => {
        if(d.isValid()) temp = false;
      });
    }
    return temp;
  };
  
  const [process, setProcess] = useState('');
  const [selectedData, setSelectedData] = useState(null);
  const onModalProcess = (e=null, p='', d=null) => {
    if(e) e.preventDefault();
    if(p){
      setProcess(p);
      if(d) setSelectedData(d);
      else setSelectedData(null);
    }else{
      setProcess('');
    }
  };

  /* eslint-disable */
	useEffect(() => {
    setImages([...props.images].map(d => new FileModel(d)));
  }, [props.images]);
  /* eslint-enable */

  return (
    <>
      <div className={`img-uploader ${props.process}`}>
        <div className="scroll-wrapper">
          {images.map((d, i) => (
            <Fragment key={`img_${i}`}>
              {d.isValid()? (
                <div className="img-block">
                  {d.path.includes('.mp4')? (
                    <div className="video-container c-pointer" onClick={e => onModalProcess(e, 'read', d)}>
                      <video muted autoPlay loop>
                        <source src={d.path} type="video/mp4" />
                      </video>
                    </div>
                  ): (
                    <div className="img-container c-pointer" onClick={e => onModalProcess(e, 'read', d)}>
                      <img src={d.path} alt="Preview" />
                    </div>
                  )}
                  <div className="img-desc color-dark">
                    <p className="text xxs fw-600">{d.originalname}</p>
                    <p className="text xxxs fw-400 lh-sm">
                      <span className="fw-600">Size :</span> {d.displaySize()}
                    </p>
                  </div>
                  {['create', 'update'].indexOf(props.process) > -1? (
                    <>
                      <div className="btn-delete" onClick={e => onModalProcess(e, 'delete', d)}>
                        <em className="fa-solid fa-xmark"></em>
                      </div>
                      {props.isMultiple? (
                        <>
                          <div className={`btn-prev ${i <= 0? 'disabled': ''}`} 
                            onClick={e => onReorderFile(e, i, -1)} 
                          >
                            <em className="fa-solid fa-caret-left"></em>
                          </div>
                          <div className={`btn-next ${i+1 >= images.length? 'disabled': ''}`} 
                            onClick={e => onReorderFile(e, i, +1)} 
                          >
                            <em className="fa-solid fa-caret-right"></em>
                          </div>
                        </>
                      ): (<></>)}
                    </>
                  ): (<></>)}
                </div>
              ): (<></>)}
            </Fragment>
          ))}
        </div>
        {['create', 'update'].indexOf(props.process) > -1? (
          <div className="btn-wrapper">
            {isAddable()? (
              <div className="img-block btn-upload">
                <em className="fa-solid fa-plus"></em>
                <input
                  type="file" ref={inputRef} 
                  accept={props.accept} onChange={onChangeFile} 
                  required={ props.required} 
                />
              </div>
            ): (<></>)}
          </div>
        ): (<></>)}
      </div>

      <div className={`popup-container ${process === 'read'? 'active': ''}`}>
        <div className="wrapper">
          <div className="close-filter" onClick={onModalProcess}></div>
          {selectedData !== null && selectedData.path? (
            selectedData.path.includes('.mp4')? (
              <div className="popup-video">
                <div className="video-container">
                  <div className="wrapper">
                    <video muted autoPlay loop>
                      <source src={selectedData.path} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            ): (
              <div className="popup-img">
                <img src={selectedData.path} alt="Preview" />
              </div>
            )
          ): (<></>)}
        </div>
      </div>
      <div className={`popup-container ${process === 'delete'? 'active': ''}`}>
        <div className="wrapper">
          <div className="popup-box">
            <div className="popup-header">
              <h6 className="fw-600 lh-xs">ยืนยันการลบข้อมูล</h6>
              <div className="btn-close" onClick={onModalProcess}>
                <div className="hamburger active">
                  <div></div><div></div><div></div>
                </div>
              </div>
            </div>
            <div className="popup-body">
              <p className="fw-500">
                กรุณายืนยันการลบข้อของคุณ ข้อมูลไม่สามารถนำกลับมาได้หลังจากถูกลบไปแล้ว
              </p>
            </div>
            <div className="popup-footer">
              <div className="btns mt-0">
                <button type="button" className="btn btn-action btn-p" onClick={onFileDelete}>
                  ยืนยันการลบ
                </button>
                <button type="button" className="btn btn-action btn-default" onClick={onModalProcess}>
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ImageUploader.defaultProps = {
  process: 'create',
  accept: 'image/png,image/jpeg,image/gif',
  required: false,
  isMultiple: false,
  images: [],
  resize: null,
  onChangeImage: () => {}
};
ImageUploader.propTypes = {
	process: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  isMultiple: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  onChangeImage: PropTypes.func
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {
  processFileUpload: userFileUpload
})(ImageUploader);
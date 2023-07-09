import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { userFileUpload } from '../actions/user.actions';


function AvatarUploader(props) {
  
  const onChangeFile = async (e) => {
    e.preventDefault();
    let res = await props.processFileUpload(e.target.files[0], false, 'avatars', 250);
    if(res) props.onChangeAvatar(res);
  };

  return (
    <div className="avatar-uploader">
      <div className="wrapper">
        <div className="avatar md">
          <div className="avatar-bg" style={{ backgroundImage: `url('${props.avatar.path}')` }}></div>
        </div>
        <div className="avatar-option">
          {props.process === 'view'? (
            <div className="btn btn-action btn-p btn-xs pe-none">
              <em className="fa-solid fa-camera mr-2"></em> รูปโปรไฟล์
            </div>
          ): (
            <div className="avatar-btn btn btn-action btn-p btn-xs">
              <em className="fa-solid fa-camera mr-2"></em> แก้ไขรูปโปรไฟล์
              <input type="file" accept="image/png,image/jpeg" onChange={onChangeFile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AvatarUploader.defaultProps = {
  process: 'create'
};
AvatarUploader.propTypes = {
	process: PropTypes.string.isRequired,
  avatar: PropTypes.object.isRequired,
  onChangeAvatar: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {
  processFileUpload: userFileUpload
})(AvatarUploader);
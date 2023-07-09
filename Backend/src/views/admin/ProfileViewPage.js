import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onMounted } from '../../helpers/frontend';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';
import { UserModel } from '../../models';


function ProfileViewPage(props) {
  const user = new UserModel(props.user);

  const values = new UserModel(user);
  
  /* eslint-disable */
	useEffect(() => { onMounted(); props.setSidenavActiveIndex(0); }, []);
  /* eslint-enable */

  return (
    <div className="app-container">
      <Breadcrumb 
        title={`Profile`} 
        structure={[
          { title: 'Admin', to: '/admin' },
          { title: 'Profile', to: '/admin/profile' }
        ]}
      />

      <div className="app-card mt-4">
        <div className="avatar-profile">
          <div className="avatar-img">
            <div className="avatar xxl">
              <div className="avatar-bg" style={{ backgroundImage: `url('${values.avatar.path}')` }}></div>
            </div>
          </div>
          <div className="avatar-desc">
            <h5 className="fw-500 lh-sm">{values.displayName()}</h5>
            <p className="fw-500 op-60">ตำแหน่ง : {values.displayRole()}</p>
            <div className="btns mt-2">
              <Link to={`/admin/profile/update`} className="btn btn-action btn-p btn-xs">
                <em className="fa-regular fa-pen-to-square mr-1"></em> แก้ไขข้อมูล
              </Link>
              <Link to="/admin" className="btn btn-action btn-default btn-xs">
                ย้อนกลับ
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="app-card p-0 mt-4">
        <div className="app-card-block">
          <p className="lg fw-800">ข้อมูลบัญชีผู้ใช้</p>
          <div className="ss-sep-01 mt-3"></div>
          <div className="grids">
            <div className="grid lg-40 md-50 sm-100">
              <span className="fw-700">ชื่อ-นามสกุล :</span> {values.displayName()}
            </div>
            <div className="grid lg-40 md-50 sm-100">
              <span className="fw-700">ชื่อผู้ใช้ :</span> {values.username}
            </div>
            <div className="sep"></div>
            <div className="grid lg-40 md-50 sm-100">
              <span className="fw-700">อีเมล :</span> {values.email}
            </div>
            <div className="grid lg-40 md-50 sm-100">
              <span className="fw-700">สถานะ :</span> {values.displayStatus()}
            </div>
          </div>
        </div>
      </div>
      <div className="app-card p-0 mt-4">
        <div className="app-card-block">
          <p className="lg fw-800">ข้อมูลติดต่อ</p>
          <div className="ss-sep-01 mt-3"></div>
          <div className="grids">
            <div className="grid lg-40 md-50 sm-100">
              <span className="fw-700">เบอร์โทรศัพท์ :</span> {values.telephone? values.telephone: '-'}
            </div>
            <div className="sep"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

ProfileViewPage.defaultProps = {
	
};
ProfileViewPage.propTypes = {
  
};

const mapStateToProps = (state) => ({
	user: state.user.user
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex
})(ProfileViewPage);
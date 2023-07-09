import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { onMounted } from '../../helpers/frontend';
import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';
import { processRead, processUpdate } from '../../actions/admin.actions';
import { UserModel } from '../../models';


function AdminViewPage(props) {
  const user = new UserModel(props.user);
  const history = useNavigate();
  const params = useParams();
  const process = params.process? params.process: 'view';
  const dataId = params.dataId? params.dataId: null;

  const [values, setValues] = useState(new UserModel({ status: 1 }));
  
  /* eslint-disable */
	useEffect(() => { onMounted(); props.setSidenavActiveIndex(2); }, []);
	useEffect(() => {
    setValues(new UserModel({ status: 1 }));
    props.processRead('user', { _id: dataId, isAdmin: 1 }, true).then(d => {
      setValues(d);
    }).catch(() => history('/admin/admins'));
  }, []);
  /* eslint-enable */

  return (
    <>
      <div className="app-container">
        <Breadcrumb 
          title={`${process} Admin`} 
          structure={[
            { title: 'Admin', to: '/admin' },
            { title: 'Admin Management', to: '/admin/admins' }
          ]}
        />

        <div className="app-card mt-4">
          <div className="avatar-profile">
            <div className="avatar-img">
              <div className="avatar xxl">
                <div className="avatar-bg" 
                  style={{
                    backgroundImage: `url('${values.avatar.path
                      ? values.avatar.path: '/assets/img/default/avatar.jpg'}')`
                  }} 
                ></div>
              </div>
            </div>
            {values.isValid()? (
              <div className="avatar-desc">
                <h5 className="fw-500 lh-sm">{values.displayName()}</h5>
                <p className="fw-500 op-60">ตำแหน่ง : {values.displayRole()}</p>
                <div className="btns mt-2">
                  {user.isSuperAdmin() && !values.isSuperAdmin()? (
                    <Link to={`/admin/admin/update/${dataId}`} className="btn btn-action btn-p btn-xs">
                      <em className="fa-regular fa-pen-to-square mr-1"></em> แก้ไขข้อมูล
                    </Link>
                  ): (<></>)}
                  <Link to="/admin/admins" className="btn btn-action btn-default btn-xs">
                    ย้อนกลับ
                  </Link>
                </div>
              </div>
            ): (<></>)}
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
    </>
  );
}

AdminViewPage.defaultProps = {
	
};
AdminViewPage.propTypes = {
  setSidenavActiveIndex: PropTypes.func.isRequired,
	processRead: PropTypes.func.isRequired,
  processUpdate: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user.user
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex,
  processRead: processRead,
  processUpdate: processUpdate
})(AdminViewPage);
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onMounted, appLogo } from '../../helpers/frontend';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';
import { userSignin } from '../../actions/user.actions';


function SigninPage(props) {
  const [values, setValues] = useState({ username: '', password: '' });
  const onChangeInput = (key, val, isNumber=false) => {
    if(isNumber) val = val || val===0? Number(val): '';
    setValues({ ...values, [key]: val });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    var res = await props.processSignin(values, true);
    if(res){
      setTimeout(() => {
        window.location.href = '/admin';
      }, 300);
    }else{
      onChangeInput('password', '');
    }
  };
  
  /* eslint-disable */
	useEffect(() => { onMounted(); props.setSidenavActiveIndex(0) }, []);
  /* eslint-enable */

  return (
    <section className="auth-01 section-padding">
      <div className="bg-img" style={{ backgroundImage: `url('/assets/img/bg/01.jpg')` }}></div>
      <div className="container">
        <div className="auth-container bradius box-shadow">
          <div className="auth-body bg-white">
            <div className="title">
              <img className="logo" src={appLogo()} alt="Logo" />
              <div className="text">
                <h5 className="fw-900 lh-sm">เข้าสู่ระบบ</h5>
                <p className="fw-600 op-70">Back Office System</p>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="grids mt-4">
                <div className="grid sm-100">
                  <div className="form-control">
                    <input
                      type="text" required={true} placeholder="ชื่อผู้ใช้ / อีเมล" className="lg" 
                      value={values.username? values.username: ''} 
                      onChange={e => onChangeInput('username', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="grid sm-100">
                  <div className="form-control">
                    <input
                      type="password" required={true} placeholder="รหัสผ่าน" className="lg" 
                      value={values.password? values.password: ''} 
                      onChange={e => onChangeInput('password', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <div className="btns">
                <button type="submit" className="btn btn-action btn-p btn-lg w-full">
                  เข้าสู่ระบบ
                </button>
              </div>
            </form>
            <p className="sm color-gray text-center mt-6">
              ลืมรหัสผ่าน? <Link to="/auth/forget-password" className="color-s h-color-p fw-600">ตั้งรหัสผ่านใหม่</Link>
            </p>
          </div>
          <div className="auth-footer bg-s color-white">
            <p className="xxs fw-300 text-center">
              © 2022 Tech Origin Co., Ltd. <span className="xs-hide">All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

SigninPage.defaultProps = {
	
};
SigninPage.propTypes = {
	setSidenavActiveIndex: PropTypes.func.isRequired,
	processSignin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex,
  processSignin: userSignin
})(SigninPage);
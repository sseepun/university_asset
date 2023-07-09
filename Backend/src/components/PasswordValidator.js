import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { connect } from 'react-redux';


function PasswordValidator(props) {
  const [valid1, setValid1] = useState(false);
  const [valid2, setValid2] = useState(false);
  const [valid3, setValid3] = useState(false);
  
  /* eslint-disable */
	useEffect(() => {
    setValid1(props.password.length >= 6);
    setValid2((/^(?=.*[0-9]).*$/).test(props.password));
    setValid3((/^(?=.*[!@#$&*?%^()]).*$/).test(props.password));
  }, [props.password]);
  /* eslint-enable */

  return (
    props.process !== 'view'? (
      <div>
        <p className="xs fw-500">ข้อแนะนำการตั้งรหัสผ่าน</p>
        <ul>
          <li className={`xs fw-500 ${valid1? 'color-p': 'op-60'}`}>
            ขั้นต่ำ 6 ตัวอักษร
          </li>
          <li className={`xs fw-500 ${valid2? 'color-p': 'op-60'}`}>
            ตัวเลข 0-9 อย่างน้อย 1 ตัว
          </li>
          <li className={`xs fw-500 ${valid3? 'color-p': 'op-60'}`}>
            สัญลักษณ์ * ! @ # $ & ? % ^ ( ) อย่างน้อย 1 ตัว
          </li>
        </ul>
      </div>
    ): (<></>)
  );
}

PasswordValidator.defaultProps = {
  process: 'create',
  password: ''
};
PasswordValidator.propTypes = {
	process: PropTypes.string,
	password: PropTypes.string
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {
  
})(PasswordValidator);
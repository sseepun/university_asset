import { connect } from 'react-redux';


function Footer(props) {
  return (
    <footer className="footer bcolor-fgray color-dark">
      <div className="container">
        <p className="sm fw-500 text-center">
          © 2022 Tech Origin Co., Ltd. <span className="xs-hide">All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  
};
Footer.propTypes = {
	
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {

})(Footer);
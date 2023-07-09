import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';


function Breadcrumb(props) {
  return (
    <div className="app-card">
      <div className="breadcrumb">
        <h6 className="title fw-800 lh-sm">{props.title}</h6>
        <div className="structure color-gray">
          {props.structure.map((d, i) => (
            <Fragment key={`page_${i}`}>
              {props.structure.length-1 === i? (
                <div className="color-p">{d.title}</div>
              ): (
                <>
                  <Link className="h-color-p" to={d.to}>{d.title}</Link>
                  <div className="ml-1 mr-1">/</div> 
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

Breadcrumb.defaultProps = {
  
};
Breadcrumb.propTypes = {
	title: PropTypes.string.isRequired,
  structure: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {

})(Breadcrumb);
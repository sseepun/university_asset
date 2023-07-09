import PropTypes from 'prop-types';

import { connect } from 'react-redux';


function Pagination(props) {
  const onChangePage = (e, page) => {
    e.preventDefault();
    props.onChangePage(page);
  };
  const onChangePerPage = (pp) => {
    props.onChangePerPage(pp);
  };

  return (
    <div className="table-footer">
      <div className="option ws-nowrap">
        <p className="sm fw-500 mr-1">แสดง</p>
        <select 
          className="sm w-auto" 
          value={props.paginate.pp || props.paginate.pp===0? props.paginate.pp: 10} 
          onChange={e => onChangePerPage(Number(e.target.value))} 
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <p className="sm fw-500 ml-1">ต่อหน้า</p>
      </div>
      <div className="option option-detail">
        <p>
          {props.paginate.total? (
            <>{(props.paginate.page-1)*props.paginate.pp + 1} - {Math.min(props.paginate.page*props.paginate.pp, props.paginate.total)}</>
          ): (<>0</>)} จาก {props.paginate.total}
        </p>
      </div>
      <div className="option option-paginate">
        <div className="paginate">
          <div className="page-set">
            <div 
              className={`page ${props.paginate.page <= 1? 'disabled': ''}`} 
              onClick={e => onChangePage(e, 1)} 
            >
              <em className="fa-solid fa-angles-left"></em>
            </div>
            <div 
              className={`page ${props.paginate.page-1 <= 0? 'disabled': ''}`} 
              onClick={e => onChangePage(e, props.paginate.page-1)} 
            >
              <em className="fa-solid fa-chevron-left"></em>
            </div>
          </div>
          <div className="page-set">
            {props.paginate.totalPages() <= 0? (
              <div className="page disabled">1</div>
            ): props.paginate.totalPages() <= 7? (
              Array(props.paginate.totalPages()).fill(null).map((_, i) => (
                <div 
                  key={`page_${i}`} onClick={e => onChangePage(e, i+1)} 
                  className={`page ${i+1 === props.paginate.page? 'active': ''}`} 
                >
                  {i+1}
                </div>
              ))
            ): (
              props.paginate.page <= 3? (
                <>
                  {Array(5).fill(null).map((_, i) => (
                    <div 
                      key={`page_${i}`} onClick={e => onChangePage(e, i+1)} 
                      className={`page ${i+1 === props.paginate.page? 'active': ''}`} 
                    >
                      {i+1}
                    </div>
                  ))}
                  <div className="page page-dots">...</div>
                  <div className="page" onClick={e => onChangePage(e, props.paginate.totalPages())}>
                    {props.paginate.totalPages()}
                  </div>
                </>
              ): props.paginate.page > props.paginate.totalPages()-3 ? (
                <>
                  <div className="page" onClick={e => onChangePage(e, 1)}>1</div>
                  <div className="page page-dots">...</div>
                  {Array(5).fill(null).map((_, i) => (
                    <div 
                      key={`page_${i}`} onClick={e => onChangePage(e, props.paginate.totalPages()-4+i)} 
                      className={`page ${props.paginate.totalPages()-4+i === props.paginate.page? 'active': ''}`} 
                    >
                      {props.paginate.totalPages()-4+i}
                    </div>
                  ))}
                </>
              ): (
                <>
                  <div className="page page-dots">...</div>
                  {Array(5).fill(null).map((_, i) => (
                    <div 
                      key={`page_${i}`} onClick={e => onChangePage(e, props.paginate.page-2+i)} 
                      className={`page ${props.paginate.page-2+i === props.paginate.page? 'active': ''}`} 
                    >
                      {props.paginate.page-2+i}
                    </div>
                  ))}
                  <div className="page page-dots">...</div>
                </>
              )
            )}
          </div>
          <div className="page-set">
            <div 
              className={`page ${props.paginate.page+1 > props.paginate.totalPages()? 'disabled': ''}`} 
              onClick={e => onChangePage(e, props.paginate.page+1)} 
            >
              <em className="fa-solid fa-chevron-right"></em>
            </div>
            <div 
              className={`page ${props.paginate.totalPages() <= props.paginate.page? 'disabled': ''}`} 
              onClick={e => onChangePage(e, props.paginate.totalPages())} 
            >
              <em className="fa-solid fa-angles-right"></em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Pagination.defaultProps = {
  
};
Pagination.propTypes = {
	paginate: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangePerPage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	
});

export default connect(mapStateToProps, {

})(Pagination);
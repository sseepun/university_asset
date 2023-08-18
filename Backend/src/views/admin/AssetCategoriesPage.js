import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { onMounted, scrollToRef } from '../../helpers/frontend';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';

import { connect } from 'react-redux';
import { setSidenavActiveIndex } from '../../actions/app.actions';
import { processClear, processList, processDelete } from '../../actions/admin.actions';
import { PaginateModel } from '../../models';

function AssetCategoriesPage(props) {
  const tableRef = useRef(null);

  const [dataFilter, setDataFilter] = useState({ keywords: '', status: '' });
  const onChangeDataFilter = (key, val, isNumber=false) => {
    if(isNumber) val = val || [0, -1].indexOf(val) > -1? Number(val): '';
    setDataFilter({ ...dataFilter, [key]: val });
  };

  const onSubmitDataFilter = (e=null) => {
    if(e) e.preventDefault();
    setPaginate(new PaginateModel({ ...paginate, page: 1 }));
    onLoadData(null, { ...paginate, page: 1 });
    scrollToRef(tableRef);
  };

  const [paginate, setPaginate] = useState(new PaginateModel({}));
  const onChangePage = (page) => {
    setPaginate(new PaginateModel({ ...paginate, page: page }));
    onLoadData(null, { ...paginate, page: page });
    scrollToRef(tableRef);
  };
  const onChangePerPage = (pp) => {
    setPaginate(new PaginateModel({ ...paginate, pp: pp, page: 1 }));
    onLoadData(null, { ...paginate, pp: pp, page: 1 });
    scrollToRef(tableRef);
  };
  
  const [loading, setLoading] = useState(true);
  const onLoadData = async (e=null, listPaginate=null) => {
    if(e) e.preventDefault();
    setLoading(true);
    props.processClear('asset-categories');
    let res = await props.processList('asset-categories', {
      paginate: listPaginate? listPaginate: paginate,
      dataFilter: dataFilter
    }, true);
    setPaginate(res.paginate);
    setLoading(false);
  };

  
  const [selectedData, setSelectedData] = useState(null);
  const onModalToggle = (e=null, d=null) => {
    if(e) e.preventDefault();
    setSelectedData(d);
  };

  const onSubmitDelete = async (e) => {
    e.preventDefault();
    if(selectedData){
      let res = await props.processDelete('asset-category', { _id: selectedData._id }, true);
      if(res) onLoadData();
    }
    onModalToggle();
  };


  /* eslint-disable */
	useEffect(() => { onMounted(); props.setSidenavActiveIndex(21); }, []);
	useEffect(() => { onLoadData(null, paginate); }, []);
  /* eslint-enable */

  return (
    <>
      <div className="app-container">
        <Breadcrumb 
          title="Asset Category Management" 
          structure={[
            { title: 'Admin', to: '/admin' },
            { title: 'Asset Category Management', to: '/admin/asset-categories' }
          ]}
        />

        <div className="app-card pt-0 mt-4">
          <form onSubmit={onSubmitDataFilter}>
            <div className="grids">
              <div className="grid sm-100 md-50 lg-50 mt-0">
                <div className="grids">
                  <div className="grid sm-50">
                    <div className="form-control">
                      <div className="input-icon">
                        <input
                          type="text" placeholder="ค้นหา..." 
                          value={dataFilter.keywords? dataFilter.keywords: ''} 
                          onChange={e => onChangeDataFilter('keywords', e.target.value)} 
                        />
                        <button type="submit" className="icon-wrapper">
                          <em className="fa-solid fa-magnifying-glass"></em>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm-50">
                    <div className="form-group">
                      <select 
                        value={dataFilter.status || dataFilter.status===0? dataFilter.status: ''} 
                        onChange={e => onChangeDataFilter('status', e.target.value, true)} 
                      >
                        <option value="">เลือกสถานะ</option>
                        <option value="1">เปิดใช้งาน</option>
                        <option value="0">ปิดใช้งาน</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid xs-50 sm-50 md-20 lg-25">
                <div className="d-flex ai-center">
                  <button type="submit" className="btn btn-action btn-p mr-2">
                    ค้นหา
                  </button>
                </div>
              </div>
              <div className="grid xs-50 sm-50 md-30 lg-25 text-right">
                <Link to="/admin/asset-category/create" className="btn btn-action btn-info">
                  <em className="fa-solid fa-plus mr-2"></em> สร้าง
                </Link>
              </div>
            </div>
          </form>
          <div className="table-wrapper pt-4">
            <table className="table" ref={tableRef}>
              <thead>
                <tr>
                  <th style={{ minWidth: 100, maxWidth: 100 }} className="text-center">รูปภาพ</th>
                  <th style={{ minWidth: 180, width: '100%' }}>ชื่อประเทภ</th>
                  <th style={{ minWidth: 160 }}>ลิงค์</th>
                  <th style={{ minWidth: 110 }} className="text-center">ลำดับ</th>
                  <th style={{ minWidth: 110 }} className="text-center">สถานะ</th>
                  <th style={{ minWidth: 110 }} className="text-center">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {loading? (
                  <tr><td colSpan={6} className="text-center">กำลังโหลดข้อมูล...</td></tr>
                ): (
                  props.list && props.list.length? (
                    props.list.map((d, i) => (
                      <tr key={i}>
                        <td>
                          <div className="table-img">
                            <img alt="Category" 
                              src={d.image.path? d.image.path: '/assets/img/default/img.jpg'} 
                            />
                          </div>
                        </td>
                        <td className="ws-nowrap">
                          <Link to={`/admin/asset-category/view/${d._id}`} className="h-color-p">
                            {d.name}
                          </Link>
                        </td>
                        <td className="ws-nowrap">{d.url}</td>
                        <td className="text-center">{d.order}</td>
                        <td className="text-center">{d.displayStatus()}</td>
                        <td className="text-center">
                          <Link to={`/admin/asset-category/view/${d._id}`} className="table-option color-info">
                            <em className="fa-regular fa-eye"></em>
                          </Link>
                          <Link to={`/admin/asset-category/update/${d._id}`} className="table-option color-success">
                            <em className="fa-regular fa-pen-to-square"></em>
                          </Link>
                          <span onClick={e => onModalToggle(e, d)} className="table-option color-danger">
                            <em className="fa-regular fa-trash-can"></em>
                          </span>
                        </td>
                      </tr>
                    ))
                  ): (
                    <tr><td colSpan={6} className="text-center">ไม่พบข้อมูลในระบบ</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            paginate={paginate} 
            onChangePage={onChangePage} 
            onChangePerPage={onChangePerPage} 
          />
        </div>

        <Footer />
      </div>

      <div className={`popup-container ${selectedData? 'active': ''}`}>
        <div className="wrapper">
          <div className="popup-box">
            <div className="popup-header">
              <h6 className="fw-600 lh-xs">ยืนยันการลบข้อมูล</h6>
              <div className="btn-close" onClick={onModalToggle}>
                <div className="hamburger active">
                  <div></div><div></div><div></div>
                </div>
              </div>
            </div>
            <form onSubmit={onSubmitDelete}>
              <div className="popup-body">
                <p className="fw-500">
                  กรุณายืนยันการลบข้อมูล ข้อมูลไม่สามารถนำกลับมาได้หลังจากถูกลบไปแล้ว
                </p>
              </div>
              <div className="popup-footer">
                <div className="btns mt-0">
                  <button type="submit" className="btn btn-action btn-p">
                    ยืนยันการลบ
                  </button>
                  <button type="button" className="btn btn-action btn-default" onClick={onModalToggle}>
                    ปิด
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

AssetCategoriesPage.defaultProps = {
	
};
AssetCategoriesPage.propTypes = {
	setSidenavActiveIndex: PropTypes.func.isRequired,
  processClear: PropTypes.func.isRequired,
  processList: PropTypes.func.isRequired,
  processDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  list: state.asset.categories,
});

export default connect(mapStateToProps, {
  setSidenavActiveIndex: setSidenavActiveIndex,
  processClear: processClear,
  processList: processList,
  processDelete: processDelete,
})(AssetCategoriesPage);
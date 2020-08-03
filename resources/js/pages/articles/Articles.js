import React, {useEffect, useState } from "react";
import { Typography, CircularProgress, Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle/PageTitle";
import client from '../../api/client';
import useDebounce from '../../util/debounce';

export default function Articles() {
  const [ refresh, setRefresh ] = useState(false);
  const [ datatableData, setDatatableData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ count, setCount ] = useState(10);
  const [ rowsPerPage, setRowsPerPage ] = useState('');
  const [ page, setPage ] = useState(1);
  const [ sortOrder, setSortOrder ] = useState('');
  const [ filter, setFilter ] = useState('');

  const debouncedSearchTerm = useDebounce(filter, 500);

  useEffect(
    () => {
      const fetchData = async () => {
        setLoading(true);
        
        await client('/api/v1/articles?page=' + page + sortOrder + debouncedSearchTerm + rowsPerPage)
          .then((data) => {
            setDatatableData(data.data);
            setCount(data.total);
          })
          .catch(() => null);

        setLoading(false);
      };
      fetchData();
    },
    [ refresh, page, sortOrder, debouncedSearchTerm, rowsPerPage ]
  );

  const columns = [
    {
     name: "id",
     label: "id",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "title",
     label: "title",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "description",
     label: "description",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "content",
     label: "content",
     options: {
      filter: true,
      sort: false,
     }
    },
   ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    serverSide: true,
    count: count,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50, 100, 250],
    sort: true,
    jumpToPage: true,
    sortOrder: sortOrder,
    onTableChange: (action, tableState) => {

      console.log(action, tableState);
       
      switch (action) {
        case 'changePage':
          setPage(tableState.page + 1);
          break;
        case 'changeRowsPerPage':
          let changeRowsPerPage = '&per_page=' + tableState.rowsPerPage;
          setRowsPerPage(changeRowsPerPage);
          break;
        case 'sort':
          let sort = '&sort=' + tableState.sortOrder.name + '|' + tableState.sortOrder.direction;
          setSortOrder(sort);
          break;
        case 'search':
          let filter = '&filter=' + tableState.searchText;
          setFilter(filter);
          break;
        default:
          console.log('action not handled.');
      }
    }
  };   

  return (
    <>
      <PageTitle title="Article" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title={
            <Typography variant="h6">
            Articles list
            {loading && <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />}
            </Typography>
            }
            data={datatableData}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
    </>
  );
}

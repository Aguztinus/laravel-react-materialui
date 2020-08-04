import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Grid, Button } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';

// components
import PageTitle from '../../components/PageTitle/PageTitle';
import client from '../../api/client';
import useDebounce from '../../util/debounce';
import moment from 'moment';

export default function Articles() {
	const [ refresh, setRefresh ] = useState(false);
	const [ datatableData, setDatatableData ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ count, setCount ] = useState(10);
	const [ rowsPerPage, setRowsPerPage ] = useState('');
	const [ page, setPage ] = useState(1);
	const [ sortOrder, setSortOrder ] = useState('');
	const [ filter, setFilter ] = useState('');
	const [ filterDrop, setFilterDrop ] = useState('');

	const debouncedSearchTerm = useDebounce(filter, 500);

	useEffect(
		() => {
			const fetchData = async () => {
				setLoading(true);
				console.log(filterDrop);

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
		[ refresh, page, sortOrder, debouncedSearchTerm, rowsPerPage, filterDrop ]
	);

	const handleFilterSubmit = (applyFilters) => {
		let filterList = applyFilters();
		let uri = `&filters=${filterList}`;
		setFilterDrop(uri);
	};

	const columns = [
		{
			name: 'id',
			label: 'id',
			options: {
				filter: true,
				sort: true
			}
		},
		{
			name: 'title',
			label: 'title',
			options: {
				filter: true,
				sort: true
			}
		},
		{
			name: 'description',
			label: 'description',
			options: {
				filter: false,
				sort: false
			}
		},
		{
			name: 'content',
			label: 'content',
			options: {
				filter: false,
				sort: false
			}
		},
		{
			name: 'published_at',
			label: 'published_at',
			options: {
				filter: true,
				sort: true,
				customBodyRender: (value) => {
					return moment(value).format('DD-MM-YYYY');
				}
			}
		},
		{
			name: 'action',
			label: 'Actions',
			options: {
				filter: false,
				customBodyRender: (value, tableMeta) => {
					return <Button onClick={() => console.log(value, tableMeta)}>Edit</Button>;
				}
			}
		}
	];

	const options = {
		filter: true,
		filterType: 'dropdown',
		responsive: 'vertical',
		serverSide: true,
		count: count,
		rowsPerPage: 10,
		rowsPerPageOptions: [ 10, 20, 50, 100, 150 ],
		sort: true,
		jumpToPage: true,
		sortOrder: sortOrder,
		onTableChange: (action, tableState) => {
			//console.log(action, tableState);

			switch (action) {
				case 'changePage':
					setPage(tableState.page + 1);
					break;
				case 'changeRowsPerPage':
					var changeRowsPerPage = '&per_page=' + tableState.rowsPerPage;
					setRowsPerPage(changeRowsPerPage);
					break;
				case 'sort':
					var sort = '&sort=' + tableState.sortOrder.name + '|' + tableState.sortOrder.direction;
					setSortOrder(sort);
					break;
				case 'search':
					var filter = '&filter=' + tableState.searchText;
					setFilter(filter);
					break;
				default:
					console.log('action not handled.');
			}
		},
		confirmFilters: true,
		customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
			return (
				<div style={{ marginTop: '40px' }}>
					<Button variant="contained" onClick={() => handleFilterSubmit(applyNewFilters)}>
						Apply Filters
					</Button>
				</div>
			);
		},
		onFilterChange: (changedColumn, filterList) => {
			//console.log(changedColumn, filterList);
		},
		onRowsDelete: (rowsDeleted, data) => {
			//console.log(rowsDeleted, data);
			//console.log(datatableData[data[0].dataIndex]);
		},
		onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
			//console.log(currentRowsSelected[0].dataIndex);
			//console.log(datatableData[currentRowsSelected[0].dataIndex]);
			//console.log(currentRowsSelected, allRowsSelected, rowsSelected);
		}
	};

	return (
		<div>
			<PageTitle title="Article" />
			<Grid container spacing={4}>
				<Grid item xs={12}>
					<MUIDataTable
						title={
							<Typography variant="h6">
								Articles list
								{loading && (
									<CircularProgress
										size={24}
										style={{ marginLeft: 15, position: 'relative', top: 4 }}
									/>
								)}
							</Typography>
						}
						data={datatableData}
						columns={columns}
						options={options}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { PageLayout } from 'layouts/pageLayout';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { DEBUG } from 'common/constants/common';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import { activeProjectSelector, userIdSelector } from 'controllers/user';
import { withPagination } from 'controllers/pagination';
import { withSorting, SORTING_DESC } from 'controllers/sorting';
import { showModalAction } from 'controllers/modal';
import { showNotification } from 'controllers/notification';
import {
  selectedLaunchesSelector,
  toggleLaunchSelectionAction,
  selectLaunchesAction,
  unselectAllLaunchesAction,
  validationErrorsSelector,
  proceedWithValidItemsAction,
  finishForceLaunchesAction,
  mergeLaunchesAction,
  compareLaunchesAction,
  launchesSelector,
  launchPaginationSelector,
  fetchLaunchesAction,
  lastOperationSelector,
  loadingSelector,
} from 'controllers/launch';
import { LaunchSuiteGrid } from 'pages/inside/common/launchSuiteGrid';
import { LaunchToolbar } from './LaunchToolbar';

const messages = defineMessages({
  filtersPageTitle: {
    id: 'LaunchesPage.title',
    defaultMessage: 'Launches',
  },
});

@connect(
  (state) => ({
    userId: userIdSelector(state),
    activeProject: activeProjectSelector(state),
    url: URLS.launches(activeProjectSelector(state)),
    selectedLaunches: selectedLaunchesSelector(state),
    validationErrors: validationErrorsSelector(state),
    launches: launchesSelector(state),
    lastOperation: lastOperationSelector(state),
    loading: loadingSelector(state),
  }),
  {
    showModalAction,
    toggleLaunchSelectionAction,
    selectLaunchesAction,
    unselectAllLaunchesAction,
    proceedWithValidItemsAction,
    finishForceLaunchesAction,
    mergeLaunchesAction,
    compareLaunchesAction,
    showNotification,
  },
)
@withSorting({
  defaultSortingColumn: 'start_time',
  defaultSortingDirection: SORTING_DESC,
})
@withPagination({
  paginationSelector: launchPaginationSelector,
  fetchAction: fetchLaunchesAction,
})
@injectIntl
export class LaunchesPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    launches: PropTypes.arrayOf(PropTypes.object),
    activePage: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    sortingColumn: PropTypes.string,
    sortingDirection: PropTypes.string,
    fetchData: PropTypes.func,
    showModalAction: PropTypes.func,
    showNotification: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onChangeSorting: PropTypes.func,
    activeProject: PropTypes.string.isRequired,
    selectedLaunches: PropTypes.arrayOf(PropTypes.object),
    validationErrors: PropTypes.object,
    selectLaunchesAction: PropTypes.func,
    unselectAllLaunchesAction: PropTypes.func,
    proceedWithValidItemsAction: PropTypes.func,
    toggleLaunchSelectionAction: PropTypes.func,
    finishForceLaunchesAction: PropTypes.func,
    mergeLaunchesAction: PropTypes.func,
    compareLaunchesAction: PropTypes.func,
    lastOperation: PropTypes.string,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    launches: [],
    activePage: 1,
    itemCount: null,
    pageCount: null,
    pageSize: null,
    sortingColumn: null,
    sortingDirection: null,
    showModalAction: () => {},
    showNotification: () => {},
    fetchData: () => {},
    onChangePage: () => {},
    onChangePageSize: () => {},
    onChangeSorting: () => {},
    selectedLaunches: [],
    validationErrors: {},
    selectLaunchesAction: () => {},
    unselectAllLaunchesAction: () => {},
    proceedWithValidItemsAction: () => {},
    toggleLaunchSelectionAction: () => {},
    finishForceLaunchesAction: () => {},
    mergeLaunchesAction: () => {},
    compareLaunchesAction: () => {},
    lastOperation: '',
    loading: false,
  };

  getTitle = () =>
    !this.props.selectedLaunches.length && this.props.intl.formatMessage(messages.filtersPageTitle);

  updateLaunch = (launch) => {
    fetch(URLS.launchesUpdate(this.props.activeProject, launch.id), {
      method: 'put',
      data: launch,
    }).then(this.props.fetchData);
  };
  deleteItem = (id) => {
    fetch(URLS.launches(this.props.activeProject, id), {
      method: 'delete',
    }).then(this.props.fetchData);
  };
  moveToDebug = (id) => {
    fetch(URLS.launchUpdate(this.props.activeProject), {
      method: 'put',
      data: {
        entities: {
          [id]: {
            mode: DEBUG.toUpperCase(),
          },
        },
      },
    }).then(this.props.fetchData);
  };
  confirmDeleteItem = (item) => {
    this.props.showModalAction({
      id: 'launchDeleteModal',
      data: { item, onConfirm: () => this.deleteItem(item.id) },
    });
  };
  confirmMoveToDebug = (item) => {
    this.props.showModalAction({
      id: 'moveToDebugModal',
      data: { onConfirm: () => this.moveToDebug(item.id) },
    });
  };

  finishForceLaunches = (eventData) => {
    let launches = [];
    eventData.id ? (launches = [eventData]) : (launches = this.props.selectedLaunches);
    this.props.finishForceLaunchesAction(launches, {
      fetchFunc: this.props.fetchData,
    });
  };

  openEditModal = (launch) => {
    this.props.showModalAction({
      id: 'launchEditModal',
      data: { launch, onEdit: this.updateLaunch },
    });
  };
  openImportModal = () => {
    this.props.showModalAction({
      id: 'launchImportModal',
      data: {
        onImport: this.props.fetchData,
      },
    });
  };

  handleAllLaunchesSelection = () => {
    const { selectedLaunches, launches } = this.props;
    if (launches.length === selectedLaunches.length) {
      this.props.unselectAllLaunchesAction();
      return;
    }
    this.props.selectLaunchesAction(launches);
  };

  proceedWithValidItems = () =>
    this.props.proceedWithValidItemsAction(this.props.lastOperation, this.props.selectedLaunches);

  mergeLaunches = () =>
    this.props.mergeLaunchesAction(this.props.selectedLaunches, {
      fetchFunc: this.props.fetchData,
    });

  compareLaunches = () => this.props.compareLaunchesAction(this.props.selectedLaunches);

  render() {
    const {
      activePage,
      itemCount,
      pageCount,
      pageSize,
      onChangePage,
      onChangePageSize,
      sortingColumn,
      sortingDirection,
      onChangeSorting,
      selectedLaunches,
      launches,
      loading,
    } = this.props;
    return (
      <PageLayout title={this.getTitle()}>
        <LaunchToolbar
          errors={this.props.validationErrors}
          selectedLaunches={selectedLaunches}
          onUnselect={this.props.toggleLaunchSelectionAction}
          onUnselectAll={this.props.unselectAllLaunchesAction}
          onProceedValidItems={this.proceedWithValidItems}
          onMerge={this.mergeLaunches}
          onForceFinish={this.finishForceLaunches}
          onCompare={this.compareLaunches}
          onImportLaunch={this.openImportModal}
        />
        <LaunchSuiteGrid
          data={launches}
          sortingColumn={sortingColumn}
          sortingDirection={sortingDirection}
          onChangeSorting={onChangeSorting}
          onDeleteItem={this.confirmDeleteItem}
          onMoveToDebug={this.confirmMoveToDebug}
          onEditLaunch={this.openEditModal}
          onForceFinish={this.finishForceLaunches}
          selectedItems={selectedLaunches}
          onItemSelect={this.props.toggleLaunchSelectionAction}
          onAllItemsSelect={this.handleAllLaunchesSelection}
          withHamburger
          loading={loading}
        />
        <PaginationToolbar
          activePage={activePage}
          itemCount={itemCount}
          pageCount={pageCount}
          pageSize={pageSize}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
        />
      </PageLayout>
    );
  }
}

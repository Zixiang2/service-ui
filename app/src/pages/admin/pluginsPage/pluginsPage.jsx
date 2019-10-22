/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { pluginsSelector } from 'controllers/plugins';
import { AUTHORIZATION_GROUP_TYPE } from 'common/constants/pluginsGroupTypes';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { PluginsTabs } from './pluginsTabs';

const messages = defineMessages({
  pageTitle: {
    id: 'PluginsPage.title',
    defaultMessage: 'Plugins',
  },
});

@connect((state) => ({
  plugins: pluginsSelector(state),
}))
@injectIntl
export class PluginsPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    plugins: PropTypes.array.isRequired,
  };

  getBreadcrumbs = () => [
    {
      title: this.props.intl.formatMessage(messages.pageTitle),
    },
  ];

  getFilterItems = () => [...new Set(this.getPlugins().map((item) => item.groupType))];

  getPlugins = () =>
    this.props.plugins.filter((item) => item.groupType !== AUTHORIZATION_GROUP_TYPE);

  render() {
    return (
      <PageLayout>
        <PageHeader breadcrumbs={this.getBreadcrumbs()} />
        <PageSection>
          <PluginsTabs plugins={this.getPlugins()} filterItems={this.getFilterItems()} />
        </PageSection>
      </PageLayout>
    );
  }
}

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

import { createSelector } from 'reselect';
import {
  createValidationErrorsSelector,
  createSelectedItemsSelector,
  createLastOperationSelector,
} from 'controllers/groupOperations';
import { escapeTestItemStringContent } from 'common/utils/escapeBackslashes';

const domainSelector = (state) => state.suites || {};
const groupOperationsSelector = (state) => domainSelector(state).groupOperations;

export const selectedSuitesSelector = createSelectedItemsSelector(groupOperationsSelector);
export const validationErrorsSelector = createValidationErrorsSelector(groupOperationsSelector);
export const lastOperationSelector = createLastOperationSelector(groupOperationsSelector);

const suitesBaseSelector = (state) => domainSelector(state).tests || [];
export const suitesSelector = createSelector(suitesBaseSelector, escapeTestItemStringContent);
export const suitePaginationSelector = (state) => domainSelector(state).pagination;

import {IStyleAPI, IStyleItem} from 'import-sort-style';

function isReact (imported) {
  return imported.moduleName === 'react';
}

function isLocal (imported) {
  return imported.moduleName.startsWith('beapp');
}

function isLocalGql (imported) {
  return imported.moduleName.startsWith('beapp/gql');
}

function isStatic (imported) {
  return imported.moduleName.startsWith('beapp/static');
}

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    and,
    not,
    or,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  return [
    {match: isReact},
    {separator: true},

    // import 'foo'
    {match: and(hasNoMember, isAbsoluteModule, not(isReact))},
    {separator: true},

    // import './foo'
    {match: and(hasNoMember, isRelativeModule, not(isReact))},
    {separator: true},

    // import … from 'fs';
    {
      match: and(isNodeModule, not(isReact)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    // import … from 'foo';
    {
      match: and(isAbsoluteModule, not(or(isLocal, isLocalGql, isReact))),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    {
      match: isLocalGql,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    {
      match: and(isLocal, not(isLocalGql)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    {
      match: isStatic,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    // import … from './foo';
    // import … from '../foo';
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
  ];
}
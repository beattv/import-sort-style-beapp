import {IStyleAPI, IStyleItem} from "import-sort-style";

function isLocal (imported) {
  return imported.moduleName.startsWith("app");
}

function isLocalGql (imported) {
  return imported.moduleName.startsWith("app/gql");
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
    // import "foo"
    {match: and(hasNoMember, isAbsoluteModule)},
    {separator: true},

    // import "./foo"
    {match: and(hasNoMember, isRelativeModule)},
    {separator: true},

    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    // import … from "foo";
    {
      match: and(isAbsoluteModule, not(or(isLocal, isLocalGql))),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    {
      match: isLocal,
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

    // import … from "./foo";
    // import … from "../foo";
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
  ];
}
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SharedLib.Model
{
    public class PaginationRequestModel
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public string Keyword { get; set; } = string.Empty;
        public string SortField { get; set; } = string.Empty;
        public string SortOrder { get; set; } = string.Empty;
    }
    public class PaginationModel<T> where T : class
    {
        public int TotalRecord { get; set; }
        public int TotalPage
        {
            get =>PageSize == 0 ? 0 :(int)Math.Ceiling((double)TotalRecord / PageSize);
        }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Data { get; set; } = [];
    }
}

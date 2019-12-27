using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.viewmodels
{
    public class vmd_response
    {
        public bool is_error { set; get; }
        public int step_code { set; get; }
        public string error_header { set; get; }
        public string error_body_detail { set; get; }
        public string process { set; get; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models
{
    public class UploadPilganViewModel
    {
        public string file_name { get; set; }
        public HttpPostedFileBase UploadedImage { get; set; }
    }
}
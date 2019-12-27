using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.viewmodels.cpmd
{
    public class vmd_GetTask
    {
        public string TASK_ID_ { set; get; }
        public string NRP_ { set; get; }
        public string MODULE_NAME_ { set; get; }
        public DateTime ASSIGN_DATE_ { set; get; }
        public int TASK_COUNT_ { set; get; }
        public int J_UNLOCK_ { set; get; }
        public string TASK_STATUS_ { set; get; }
        public string BTN_ENABLER_ { set; get; }
        public List<VW_TASKLIST_DETAIL> ChildData { set; get; }
    }
}
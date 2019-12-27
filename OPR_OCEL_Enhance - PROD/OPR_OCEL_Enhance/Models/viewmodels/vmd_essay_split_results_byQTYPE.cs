using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.viewmodels
{
    public class vmd_essay_split_results_byQTYPE
    {
        public string MODULE_SUB_ID { set; get; }
        public string MODULE_SUB_NAME { set; get; }
        public int JENIS_SOAL { set; get; }
        public int? IS_COUNT_BY_SYS { set; get; }
        public int? COUNT_QUESTION { set; get; }
        public int? TOT_VALUE { set; get; }
        public int? WEIGHT { set; get; }
        public int? AFTER_WEIGHTING { set; get; }
    }
}
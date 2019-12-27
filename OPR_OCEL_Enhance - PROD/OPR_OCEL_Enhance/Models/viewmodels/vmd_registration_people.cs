using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.viewmodels
{
    public class vmd_registration_people
    {
        private string EVENTS_;
        private string STUDENT_ID_;
        public string vREGISTRATION_ID
        {
            get;
            set;
        }

        public string vGOLONGAN
        {
            get;
            set;
        }

        public string vSTUDENT_ID
        {
            get { return STUDENT_ID_; }
            set {
                string SG_student = value;
                STUDENT_ID_ = SG_student.Replace(" ", String.Empty);
            }
        }

        public string vDSTRCT_CODE
        {
            get;
            set;
        }

        public string vDEPARTMENT
        {
            get;
            set;
        }

        public string vPOSITION_CODE
        {
            get;
            set;
        }

        public string vPOSITION_APP
        {
            get;
            set;
        }

        public string vPOSITION_DESC
        {
            get;
            set;
        }

        public bool vIS_SELF_ASSESMENT
        {
            get;
            set;
        }

        public string vEVENT_ID
        {
            get { return EVENTS_; }
            set {
                if (string.IsNullOrEmpty(value) || value.Equals("") || value.Equals(null))
                {
                    EVENTS_ = "SELFEXAM";
                }
                else
                {
                    EVENTS_ = value;
                }
            }
        }


        public string vSUB_MODULE_ID
        {
            set;
            get;
        }

        public string vEGI
        {
            get;
            set;
        }

        public string vHANDBOOK_PID
        {
            get;
            set;
        }

        public int vMEDIA
        {
            get;
            set;
        }
    }
}
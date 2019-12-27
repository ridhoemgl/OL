using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.viewmodels
{
    public class vmd_post_PilGan
    {

        private string _module_id;
        private string _module_sub_id;
        private string _image_path;
        private string _date_modified;

        public string question_id
        {
            set;
            get;
        }

        public string module_id
        {
            get { return _module_id; }
            set {
                string tempt = string.Empty;
                if (value.Length < 2)
                {
                    _module_id = ("0" + value.ToString());
                }
                else
                {
                    _module_id = value;
                }
            }
        }


        public string sub_module_id
        {
            get { return _module_sub_id; }
            set
            {
                string tempt = string.Empty;
                if (value.Length < 2)
                {
                    _module_sub_id = ("0" + value.ToString());
                }
                else
                {
                    _module_sub_id = value;
                }
            }
        }

        public string cert_for
        {
            set;
            get;
        }

        public string destination_position
        {
            set;
            get;
        }

        public int question_type
        {
            set;
            get;
        }

        public int question_max_time
        {
            set;
            get;
        }

        public int question_max_score
        {
            set;
            get;
        }

        public int question_max_answer
        {
            set;
            get;
        }

        public string question_content
        {
            set;
            get;
        }

        public string answer_1
        {
            set;
            get;
        }

        public int answer_1_score
        {
            set;
            get;
        }

        public string answer_2
        {
            set;
            get;
        }

        public int answer_2_score
        {
            set;
            get;
        }

        public string answer_3
        {
            set;
            get;
        }

        public int answer_3_score
        {
            set;
            get;
        }

        public string answer_4
        {
            set;
            get;
        }

        public int answer_4_score
        {
            set;
            get;
        }
        public string answer_5
        {
            set;
            get;
        }

        public int answer_5_score
        {
            set;
            get;
        }

        public string answer_6
        {
            set;
            get;
        }

        public int answer_6_score
        {
            set;
            get;
        }
        public string answer_7
        {
            set;
            get;
        }

        public int answer_7_score
        {
            set;
            get;
        }
        public string answer_8
        {
            set;
            get;
        }

        public int answer_8_score
        {
            set;
            get;
        }
        public string answer_9
        {
            set;
            get;
        }

        public int answer_9_score
        {
            set;
            get;
        }
        public string answer_10
        {
            set;
            get;
        }

        public int answer_10_score
        {
            set;
            get;
        }
        public string image_path
        {

            get { return _image_path; }
            set
            {
                string tempt_img = string.Empty;

                if (String.IsNullOrEmpty(value))
                {
                    _image_path = null;
                }
                else
                {
                    _image_path = value;
                }
            }
        }

        public bool is_active
        {
            set;
            get;
        }

        public string egi_general
        {
            set;
            get;
        }

        public string modification_date
        {
            set {
                DateTime myDateTime = DateTime.Now;
                _date_modified = myDateTime.ToString("yyyy-MM-dd HH:mm:ss.fff");
            }
            get { return _date_modified; }
        }

    }
}
using System;
using System.Linq;
using OPR_OCEL_Enhance.Models.viewmodels;

namespace OPR_OCEL_Enhance.Models.dbmodel
{
    public class Crud_Pilgan
    {
        public DtClass_OcelEnchDataContext ocel_conn = new DtClass_OcelEnchDataContext();

        public bool addDataPilihanGAnda(string guid , vmd_post_PilGan post , string employee)
        {
            try
            {
                
                TBL_R_QUESTION_ALL i_tbl_r_question = new TBL_R_QUESTION_ALL();
                
                i_tbl_r_question.QUESTION_ID = guid;
                i_tbl_r_question.MODULE_ID = post.module_id;
                i_tbl_r_question.MODULE_SUB_ID = post.sub_module_id;
                i_tbl_r_question.QUESTION_TYPE = post.question_type;
                i_tbl_r_question.QUESTION_MAX_TIME = post.question_max_time;
                i_tbl_r_question.QUESTION_MAX_SCORE = post.question_max_score;
                i_tbl_r_question.QUESTION_MAX_ANSWER = post.question_max_answer;
                i_tbl_r_question.QUESTION_CONTENT = post.question_content;
                i_tbl_r_question.ANSWER_1 = post.answer_1;
                i_tbl_r_question.ANSWER_2 = post.answer_2;
                i_tbl_r_question.ANSWER_3 = post.answer_3;
                i_tbl_r_question.ANSWER_4 = post.answer_4;
                i_tbl_r_question.ANSWER_5 = post.answer_5;
                i_tbl_r_question.ANSWER_6 = post.answer_6;
                i_tbl_r_question.ANSWER_7 = post.answer_7;
                i_tbl_r_question.ANSWER_8 = post.answer_8;
                i_tbl_r_question.ANSWER_9 = post.answer_9;
                i_tbl_r_question.ANSWER_10 = post.answer_10;
                i_tbl_r_question.ANSWER_1_SCORE = Convert.ToDouble(post.answer_1_score);
                i_tbl_r_question.ANSWER_2_SCORE = Convert.ToDouble(post.answer_2_score);
                i_tbl_r_question.ANSWER_3_SCORE = Convert.ToDouble(post.answer_3_score);
                i_tbl_r_question.ANSWER_4_SCORE = Convert.ToDouble(post.answer_4_score);
                i_tbl_r_question.ANSWER_5_SCORE = Convert.ToDouble(post.answer_5_score);
                i_tbl_r_question.ANSWER_6_SCORE = Convert.ToDouble(post.answer_6_score);
                i_tbl_r_question.ANSWER_7_SCORE = Convert.ToDouble(post.answer_7_score);
                i_tbl_r_question.ANSWER_8_SCORE = Convert.ToDouble(post.answer_8_score);
                i_tbl_r_question.ANSWER_9_SCORE = Convert.ToDouble(post.answer_9_score);
                i_tbl_r_question.ANSWER_10_SCORE = Convert.ToDouble(post.answer_10_score);
                i_tbl_r_question.IS_ACTIVE = post.is_active;
                i_tbl_r_question.MODIFICATION_DATE = DateTime.Now;
                i_tbl_r_question.EGI_GENERAL = post.egi_general;

                if (!string.IsNullOrEmpty(post.image_path))
                {
                    i_tbl_r_question.IMAGE_PATH = guid + post.image_path;
                }

                i_tbl_r_question.MODIFIED_BY = employee;
                i_tbl_r_question.CERT_FOR = post.cert_for;
                i_tbl_r_question.DESTINATION_POSITION = post.destination_position;
                ocel_conn.TBL_R_QUESTION_ALLs.InsertOnSubmit(i_tbl_r_question);
                ocel_conn.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool updatePilgan(vmd_post_PilGan PilGan_data , string session)
        {
            TBL_R_QUESTION_ALL tbl_question = ocel_conn.TBL_R_QUESTION_ALLs.Where(x => x.QUESTION_ID.Equals(PilGan_data.question_id)).Single<TBL_R_QUESTION_ALL>();

            try
            {
                tbl_question.MODULE_ID = PilGan_data.module_id;
                tbl_question.MODULE_SUB_ID = PilGan_data.sub_module_id;
                tbl_question.QUESTION_TYPE = PilGan_data.question_type;
                tbl_question.QUESTION_MAX_TIME = PilGan_data.question_max_time;
                tbl_question.QUESTION_MAX_SCORE = PilGan_data.question_max_score;
                tbl_question.QUESTION_MAX_ANSWER = PilGan_data.question_max_answer;
                tbl_question.QUESTION_CONTENT = PilGan_data.question_content;
                tbl_question.ANSWER_1 = PilGan_data.answer_1;
                tbl_question.ANSWER_2 = PilGan_data.answer_2;
                tbl_question.ANSWER_3 = PilGan_data.answer_3;
                tbl_question.ANSWER_4 = PilGan_data.answer_4;
                tbl_question.ANSWER_5 = PilGan_data.answer_5;
                tbl_question.ANSWER_6 = PilGan_data.answer_6;
                tbl_question.CERT_FOR = PilGan_data.cert_for;
                tbl_question.DESTINATION_POSITION = PilGan_data.destination_position;
                tbl_question.ANSWER_7 = PilGan_data.answer_7;
                tbl_question.ANSWER_8 = PilGan_data.answer_8;
                tbl_question.ANSWER_9 = PilGan_data.answer_9;
                tbl_question.ANSWER_10 = PilGan_data.answer_10;
                tbl_question.ANSWER_1_SCORE = PilGan_data.answer_1_score;
                tbl_question.ANSWER_2_SCORE = PilGan_data.answer_2_score;
                tbl_question.ANSWER_3_SCORE = PilGan_data.answer_3_score;
                tbl_question.ANSWER_4_SCORE = PilGan_data.answer_4_score;
                tbl_question.ANSWER_5_SCORE = PilGan_data.answer_5_score;
                tbl_question.ANSWER_6_SCORE = PilGan_data.answer_6_score;
                tbl_question.ANSWER_7_SCORE = PilGan_data.answer_7_score;
                tbl_question.ANSWER_8_SCORE = PilGan_data.answer_8_score;
                tbl_question.ANSWER_9_SCORE = PilGan_data.answer_9_score;
                tbl_question.ANSWER_10_SCORE = PilGan_data.answer_10_score;
                tbl_question.IS_ACTIVE = PilGan_data.is_active;
                tbl_question.EGI_GENERAL = PilGan_data.egi_general;

                if (!string.IsNullOrEmpty(PilGan_data.image_path))
                {
                    tbl_question.IMAGE_PATH = PilGan_data.image_path;
                }

                tbl_question.MODIFICATION_DATE = DateTime.Now;

                tbl_question.MODIFIED_BY = session;
                ocel_conn.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ExcelTodDatabase(object[,] data, int col, int row, string sMODULE_ID, string sMODULE_SUB_ID, string sEGI_GENERAL, string sTIPE, string sSessUpload, string sSOALTIPE, string sPOSISI)
        {
            try
            {
                for (int s = 1; s <= data.Length; s++)
                {
                    if (data[s, 1].Equals(null) && data[s, 2].Equals(null))
                    {
                        break;
                    }
                    else
                    {
                        TBL_TMP_QUESTION_ALL i_tbl_ref_ld = new TBL_TMP_QUESTION_ALL();
                        //Debug.WriteLine(s + "_sESS : " + sSessUpload);
                        //Debug.WriteLine(s + "_Pertanyaan : " + data[s, 1]);
                        //Debug.WriteLine(s + "_Jawaban 1 : " + Convert.ToString(data[s, 2]));

                        i_tbl_ref_ld.QUESTION_ID = Guid.NewGuid().ToString();
                        i_tbl_ref_ld.SESSION = sSessUpload;
                        i_tbl_ref_ld.MODULE_ID = sMODULE_ID;
                        i_tbl_ref_ld.MODULE_SUB_ID = sMODULE_SUB_ID;
                        i_tbl_ref_ld.EGI_GENERAL = sEGI_GENERAL;
                        i_tbl_ref_ld.CERT_FOR = sSOALTIPE;
                        i_tbl_ref_ld.DESTINATION_POSITION = sPOSISI;
                        i_tbl_ref_ld.QUESTION_TYPE = Convert.ToByte(sTIPE);
                        i_tbl_ref_ld.QUESTION_MAX_TIME = 0;
                        i_tbl_ref_ld.QUESTION_MAX_SCORE = 1;
                        i_tbl_ref_ld.QUESTION_MAX_ANSWER = 4;
                        i_tbl_ref_ld.QUESTION_CONTENT = Convert.ToString(data[s, 1]);
                        i_tbl_ref_ld.ANSWER_1 = Convert.ToString(data[s, 2]);
                        i_tbl_ref_ld.ANSWER_1_SCORE = Convert.ToDouble(data[s, 3]);
                        i_tbl_ref_ld.ANSWER_2 = Convert.ToString(data[s, 4]);
                        i_tbl_ref_ld.ANSWER_2_SCORE = Convert.ToDouble(data[s, 5]);
                        i_tbl_ref_ld.ANSWER_3 = Convert.ToString(data[s, 6]);
                        i_tbl_ref_ld.ANSWER_3_SCORE = Convert.ToDouble(data[s, 7]);
                        i_tbl_ref_ld.ANSWER_4 = Convert.ToString(data[s, 8]);
                        i_tbl_ref_ld.ANSWER_4_SCORE = Convert.ToDouble(data[s, 9]);
                        i_tbl_ref_ld.ANSWER_5 = Convert.ToString(data[s, 10]);
                        i_tbl_ref_ld.ANSWER_5_SCORE = Convert.ToDouble(data[s, 11]);
                        i_tbl_ref_ld.ANSWER_6 = Convert.ToString(data[s, 12]);
                        i_tbl_ref_ld.ANSWER_6_SCORE = Convert.ToDouble(data[s, 13]);
                        i_tbl_ref_ld.ANSWER_7 = Convert.ToString(data[s, 14]);
                        i_tbl_ref_ld.ANSWER_7_SCORE = Convert.ToDouble(data[s, 15]);
                        i_tbl_ref_ld.ANSWER_8 = Convert.ToString(data[s, 16]);
                        i_tbl_ref_ld.ANSWER_8_SCORE = Convert.ToDouble(data[s, 17]);
                        i_tbl_ref_ld.ANSWER_9 = Convert.ToString(data[s, 18]);
                        i_tbl_ref_ld.ANSWER_9_SCORE = Convert.ToDouble(data[s, 19]);
                        i_tbl_ref_ld.ANSWER_10 = Convert.ToString(data[s, 20]);
                        i_tbl_ref_ld.ANSWER_10_SCORE = Convert.ToDouble(data[s, 21]);
                        
                        ocel_conn.TBL_TMP_QUESTION_ALLs.InsertOnSubmit(i_tbl_ref_ld);
                        ocel_conn.SubmitChanges();
                    }
                   
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
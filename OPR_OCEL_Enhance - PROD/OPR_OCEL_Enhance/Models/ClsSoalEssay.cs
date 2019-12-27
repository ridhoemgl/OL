using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OPR_OCEL_Enhance.Models;
using System.Diagnostics;

namespace OPR_OCEL_Enhance.Models
{
    public class ClsSoalEssay
    {
        public DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();

        public IQueryable<TBL_R_MODULE> GetListDDModul()//DirektoriServer
        {
            IQueryable<TBL_R_MODULE> i_list_p = db_.TBL_R_MODULEs.OrderBy(A => A.MODULE_NAME);

            return i_list_p;
        }

        public IQueryable<TBL_R_MODULE_SUB> GetListDDSUbModul(string smodul)//DirektoriServer
        {
            IQueryable<TBL_R_MODULE_SUB> i_list_p;
            if (smodul == null)
            {
                i_list_p = db_.TBL_R_MODULE_SUBs.OrderBy(A => A.MODULE_SUB_NAME);

            }
            else
            {
                i_list_p = db_.TBL_R_MODULE_SUBs.Where(A => A.MODULE_ID == smodul).OrderBy(A => A.MODULE_SUB_NAME);
            }

            return i_list_p;
        }

        public IQueryable<TBL_R_TYPE_SOAL> GetListDJenisSoal()
        {
            IQueryable<TBL_R_TYPE_SOAL> i_list_p;
            i_list_p = db_.TBL_R_TYPE_SOALs.Where(A => A.TYPE_CODE.Equals(3) || A.TYPE_CODE.Equals(4));
            return i_list_p;
        }

        public IQueryable<TBL_R_MODULE_EGI> GetListDDEgi(string egi)//DirektoriServer
        {
            IQueryable<TBL_R_MODULE_EGI> i_list_p;
            if (egi == null)
            {
                i_list_p = db_.TBL_R_MODULE_EGIs.OrderBy(A => A.EGI_GENERAL);

            }
            else
            {
                i_list_p = db_.TBL_R_MODULE_EGIs.Where(A => A.MODULE_PID == egi).OrderBy(A => A.EGI_GENERAL);
            }

            return i_list_p;
        }

        public IQueryable<TBL_R_JENIS_UJIAN> GetListTipeSoal()//DirektoriServer
        {
            IQueryable<TBL_R_JENIS_UJIAN> i_list_p = db_.TBL_R_JENIS_UJIANs.OrderBy(A => A.JENIS_UJIAN_CODE);

            return i_list_p;
        }

        public IQueryable<TBL_M_POSITION_APP> GetListPosisi()//DirektoriServer
        {
            IQueryable<TBL_M_POSITION_APP> i_list_p = db_.TBL_M_POSITION_APPs.OrderBy(A => A.POSITION_CODE);

            return i_list_p;
        }

        public bool ExcelArrayDB(int rows, string[,] source, string sMODULE_ID, string sMODULE_SUB_ID, string sEGI_GENERAL, string sSessUpload, string sSOALTIPE, string sPOSISI , int sQtype)
        {
            try
            {
                for (int i = 0; i < source.Length; i++)
                {
                    //Debug.WriteLine("****Proses Masuk Linq****");
                    //Debug.WriteLine(source[i, 1]);
                    //Debug.WriteLine(source[i, 2]);

                    if (source[i, 1].Equals(null) && source[i, 2].Equals(null))
                    {
                        break;
                    }
                    else
                    {
                        TBL_TMP_QUESTION_ALL i_tbl_ref_ld = new TBL_TMP_QUESTION_ALL();
                        i_tbl_ref_ld.QUESTION_ID = Guid.NewGuid().ToString();
                        i_tbl_ref_ld.SESSION = sSessUpload;
                        i_tbl_ref_ld.MODULE_ID = sMODULE_ID;
                        i_tbl_ref_ld.MODULE_SUB_ID = sMODULE_SUB_ID;
                        i_tbl_ref_ld.EGI_GENERAL = sEGI_GENERAL;
                        i_tbl_ref_ld.CERT_FOR = sSOALTIPE;
                        i_tbl_ref_ld.DESTINATION_POSITION = sPOSISI;
                        i_tbl_ref_ld.QUESTION_TYPE = sQtype;
                        i_tbl_ref_ld.QUESTION_MAX_TIME = 0;
                        i_tbl_ref_ld.QUESTION_MAX_SCORE = 1;
                        i_tbl_ref_ld.QUESTION_MAX_ANSWER = 1;
                        i_tbl_ref_ld.QUESTION_CONTENT = Convert.ToString(source[i, 1]);
                        i_tbl_ref_ld.ANSWER_1 = Convert.ToString(source[i, 2]);
                        i_tbl_ref_ld.ANSWER_1_SCORE = 1;
                        i_tbl_ref_ld.ANSWER_2_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_3_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_4_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_5_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_6_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_7_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_8_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_9_SCORE = 0;
                        i_tbl_ref_ld.ANSWER_10_SCORE = 0;

                        db_.TBL_TMP_QUESTION_ALLs.InsertOnSubmit(i_tbl_ref_ld);
                        db_.SubmitChanges();
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
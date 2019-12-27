using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.dbmodel
{
    public class Copy_sqco_registration
    {
        MobileDBDataContext dbmob_ = new MobileDBDataContext();
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();

        public bool CopyRegisToLAN(string record_id)
        {
            try
            {
                tbl_t_registration listMO = dbmob_.tbl_t_registrations.Where(o => o.record_id.Equals(record_id)).FirstOrDefault();

                if (listMO != null)
                {
                    TBL_T_REGISTRATION data = db_.TBL_T_REGISTRATIONs
                        .Where(o => o.RECORD_ID == record_id)
                        .FirstOrDefault();

                    if (data != null)
                    {
                        data.EXAM_FINISH_TIME = listMO.exam_finish_time;
                        data.EXAM_STATUS = listMO.exam_status;
                        data.EXAM_SCORE = listMO.exam_score;
                        data.UPDATE_REMINDING_TIME = listMO.update_reminding_time;

                        db_.SubmitChanges();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public bool CopyAnswerToLAN(string registration_id)
        {
            try
            {
                List<tbl_t_answer> listMO = dbmob_.tbl_t_answers.Where(o => o.registration_id == registration_id).ToList();

                if (listMO.Count > 0)
                {
                    for (int i = 0; i < listMO.Count; i++)
                    {
                        TBL_T_ANSWER data = db_.TBL_T_ANSWERs
                        .Where(o => o.QA_ID == listMO[i].qa_id)
                        .FirstOrDefault();

                        if(data != null)
                        {
                            data.ANSWER_USER = listMO[i].answer_user;
                            data.STATUS = listMO[i].status;
                            data.SCORE = listMO[i].score;
                        }
                    }
                    db_.SubmitChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public bool CopyAcessorToLAN(string record_id)
        {
            try
            {
                tbl_t_request_acessor listMO = dbmob_.tbl_t_request_acessors.Where(o => o.record_id == record_id).FirstOrDefault();

                if (listMO != null)
                {
                    TBL_T_REQUEST_ACESSOR OBJ = new TBL_T_REQUEST_ACESSOR();
                    OBJ.REQUEST_PID = listMO.request_pid;
                    OBJ.RECORD_ID = listMO.record_id;
                    OBJ.CERTIFICATOR_NRP = listMO.certificator_nrp;
                    OBJ.JENIS_UJIAN_CODE = listMO.jenis_ujian_code;
                    OBJ.REQUEST_DATE = listMO.request_date;

                    db_.SubmitChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
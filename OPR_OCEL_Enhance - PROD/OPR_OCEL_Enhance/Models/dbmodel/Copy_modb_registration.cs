using OPR_OCEL_Enhance.Models.viewmodels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OPR_OCEL_Enhance.Models.dbmodel
{


    public class Copy_modb_registration
    {
        MobileDBDataContext dbmob_ = new MobileDBDataContext();
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private int steps = 0;
        private List<vmd_response> Response_Class = new List<vmd_response>();

        public bool InserAnswer_MoDB(List<TBL_T_ANSWER> AnswerSource)
        {
            List<tbl_t_answer> OBJE = new List<tbl_t_answer>();

            try
            {
                for (int i = 0; i < AnswerSource.Count; i++)
                {
                    tbl_t_answer ans = new tbl_t_answer();

                    ans._no = AnswerSource[i]._NO;
                    ans.qa_id = AnswerSource[i].QA_ID;
                    ans.registration_id = AnswerSource[i].REGISTRATION_ID;
                    ans.nrp = AnswerSource[i].NRP;
                    ans.question_id = AnswerSource[i].QUESTION_ID;
                    ans.answer_user = AnswerSource[i].ANSWER_USER;
                    ans.status = AnswerSource[i].STATUS;
                    ans.score = AnswerSource[i].SCORE;
                    ans.jenis_soal = AnswerSource[i].JENIS_SOAL;
                    OBJE.Add(ans);
                }
                dbmob_.tbl_t_answers.InsertAllOnSubmit(OBJE);
                dbmob_.SubmitChanges();

                return true;
            }
            catch (Exception e)
            {
               return false;
            }
        }

        public bool Insert_Question_Answer_TOmOdb(List<TBL_T_REGISTRATION> AllList)
        {
            try
            {
                List<tbl_t_registration> fadd = new List<tbl_t_registration>();
                for (int i = 0; i < AllList.Count; i++)
                {
                    tbl_t_registration f = new tbl_t_registration();
                    f.record_id = AllList[i].RECORD_ID;
                    f.registration_id = AllList[i].REGISTRATION_ID;
                    f.student_id = AllList[i].STUDENT_ID;
                    f.dstrct_code = AllList[i].DSTRCT_CODE;
                    f.egi = AllList[i].EGI;
                    f.department = AllList[i].DEPARTMENT;
                    f.period = AllList[i].PERIOD;
                    f.position_code = AllList[i].POSITION_CODE;
                    f.position_desc = AllList[i].POSITION_DESC;
                    f.number_of_question = AllList[i].NUMBER_OF_QUESTION;
                    f.duration_minute = AllList[i].DURATION_MINUTE;
                    f.randomized_answer = AllList[i].RANDOMIZED_ANSWER;
                    f.is_self_assesment = AllList[i].IS_SELF_ASSESMENT;
                    f.registration_date = AllList[i].REGISTRATION_DATE;
                    f.exam_actual_date = AllList[i].EXAM_ACTUAL_DATE;
                    f.exam_login_time = AllList[i].EXAM_LOGIN_TIME;
                    f.exam_finish_time = AllList[i].EXAM_FINISH_TIME;
                    f.passing_grade_percent = AllList[i].PASSING_GRADE_PERCENT;
                    f.exam_comp_id = AllList[i].EXAM_COMP_ID;
                    f.exam_status = 3;
                    f.exam_score = AllList[i].EXAM_SCORE;
                    f.event_id = AllList[i].EVENT_ID;
                    f.status_ready_exam = AllList[i].STATUS_READY_EXAM;
                    f.support_link = AllList[i].SUPPORT_LINK;
                    f.percent_complete = AllList[i].PERCENT_COMPLETE;
                    f.reminding_time = AllList[i].REMINDING_TIME;
                    f.update_reminding_time = AllList[i].UPDATE_REMINDING_TIME;
                    f.exam_start_date = AllList[i].EXAM_START_DATE;
                    f.question_type = AllList[i].QUESTION_TYPE;
                    f.sub_module_id = AllList[i].SUB_MODULE_ID;
                    f.exam_type = AllList[i].EXAM_TYPE;
                    f.exam_locations = AllList[i].EXAM_LOCATIONS;
                    fadd.Add(f);
                }
                dbmob_.tbl_t_registrations.InsertAllOnSubmit(fadd);
                dbmob_.SubmitChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public bool InsertEVentToMobile(string eventid)
        {
            try
            {
                int Event_mobile = dbmob_.tbl_t_events.Where(s => s.event_id.Equals(eventid)).Count();
                if (Event_mobile.Equals(0))
                {
                    List<TBL_T_EVENT> Events_data = db_.TBL_T_EVENTs.Where(dt => dt.EVENT_ID.Equals(eventid)).ToList();
                    bool VentMobileInsert = InsertEventMobile(Events_data);
                    if (VentMobileInsert)
                    {
                        List<TBL_T_EVENTS_TIME_DETAIL> EventDetail = db_.TBL_T_EVENTS_TIME_DETAILs.Where(Det => Det.EVENT_ID.Equals(eventid)).ToList();
                        InsertEventDetails(EventDetail);
                    }

                }

                return true;
            }
            catch (Exception)
            {
                List<TBL_T_EVENT> Events_data = db_.TBL_T_EVENTs.Where(dt => dt.EVENT_ID.Equals(eventid)).ToList();
                bool VentMobileInsert = InsertEventMobile(Events_data);
                if (VentMobileInsert)
                {
                    List<TBL_T_EVENTS_TIME_DETAIL> EventDetail = db_.TBL_T_EVENTS_TIME_DETAILs.Where(Det => Det.EVENT_ID.Equals(eventid)).ToList();
                    InsertEventDetails(EventDetail);
                }
                return false;

            }
        }

        public bool InsertEventMobile(List<TBL_T_EVENT> EVENT_DT)
        {
            List<tbl_t_event> EVN = new List<tbl_t_event>();

            try
            {

                foreach (var item in EVENT_DT)
                {
                    tbl_t_event evens = new tbl_t_event();

                    evens.event_id = item.EVENT_ID;
                    evens.test_center_id = item.TEST_CENTER_ID;
                    evens.certificator_id = item.CERTIFICATOR_ID;
                    evens.description = item.DESCRIPTION;
                    evens.long_description = item.LONG_DESCRIPTION;
                    evens.module_id = item.MODULE_ID;
                    evens.module_name = item.MODULE_NAME;
                    evens.exam_start = item.EXAM_START;
                    evens.exam_end = item.EXAM_END;
                    evens.question_type = item.QUESTION_TYPE;
                    evens.create_by = item.CREATE_BY;
                    evens.create_date = DateTime.Now;
                    evens.update_by = item.UPDATE_BY;
                    evens.update_date = DateTime.Now;
                    evens.jenis_ujian_code = item.JENIS_UJIAN_CODE;
                    evens.exam_target_min = item.EXAM_TARGET_MIN;
                    EVN.Add(evens);
                }

                dbmob_.tbl_t_events.InsertAllOnSubmit(EVN);
                dbmob_.SubmitChanges();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private bool InsertEventDetails(List<TBL_T_EVENTS_TIME_DETAIL> elist)
        {
            try
            {
                List<tbl_t_events_time_detail> obj_tdm = new List<tbl_t_events_time_detail>();

                for (int i = 0; i < elist.Count; i++)
                {
                    tbl_t_events_time_detail td = new tbl_t_events_time_detail();
                    td.code_id = elist[i].CODE_ID;
                    td.event_id = elist[i].EVENT_ID;
                    td.question_type = elist[i].QUESTION_TYPE;
                    td.time_exam = elist[i].TIME_EXAM;
                    td.weight = elist[i].WEIGHT;
                    obj_tdm.Add(td);
                }

                dbmob_.tbl_t_events_time_details.InsertAllOnSubmit(obj_tdm);
                dbmob_.SubmitChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
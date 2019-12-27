using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models.viewmodels;
using System.IO;
using System.Web;
using System.Threading.Tasks;
using System.Data;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Net;
using OfficeOpenXml;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Collections;
using Newtonsoft.Json;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class InputRegistrasiController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        MobileDBDataContext dbmob_ = new MobileDBDataContext();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private ClsInputRegistration iClsInputRegistration = new ClsInputRegistration();
        private ErrorSaveClass ES = new ErrorSaveClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        public ActionResult Index()
        {
            this.pv_CustLoadSession();

            List<int> ExceptionProfile = new List<int>(new[] { 4, 8, 9 });

            int CurrProfile = Int32.Parse(Session["GP"].ToString());

            if (Session["NRP"] == null || ExceptionProfile.Contains(CurrProfile))
            {
                return RedirectToAction("logout", "Login");
            }

            ViewBag.leftMenu = loadMenu();
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];

            return View();
        }

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
            ViewBag.gp = iStrSessGPID;
        }

        private string loadMenu()
        {
            this.pv_CustLoadSession();
            if (Session["leftMenu"] == null)
            {
                Session["leftMenu"] = menuLeftClass.recursiveMenu(0, Convert.ToInt32(iStrSessGPID));
            }
            return (string)Session["leftMenu"];
        }

        [HttpPost]
        public ActionResult dropdownLocation()
        {
            int lc_session_gp = Int32.Parse(Session["GP"].ToString());
            if (!lc_session_gp.Equals(4))
            {
                var i_tbl_ = db_.VW_R_TEST_CENTERs;
                return this.Json(new { Data = i_tbl_, Total = i_tbl_.Count() });
            }
            else
            {
                return this.Json(new { Data = string.Empty, Total = 0 });
            }
        }

        [HttpPost]
        public ActionResult dropdownExamType()
        {
            var i_tbl_ = db_.TBL_R_JENIS_UJIANs;
            return this.Json(new { Data = i_tbl_, Total = i_tbl_.Count() });
        }

        [HttpPost]
        public ActionResult pbb_MateriAvalaible(string POSITION_CODE)
        {
            var buku = db_.VW_MATERI_AVAILABLE_ON_EGIs.Where(u => u.POSITION_CODE.Equals(POSITION_CODE));
            return this.Json(new { BOOK = buku});
        }

        [HttpPost]
        public JsonResult readRegistration(string i_location, string i_positionApp, int i_type, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                //var PositionData = SparatedCommaToARr(i_positionApp);
                //var dt_ = from StudentReg in db_.VW_T_REGISTRATION_NEWs
                //          where PositionData.Contains(StudentReg.POSITION_CODE)
                //          select StudentReg;
                var dt_ = db_.cufn_CalonREgistrasi(string.Concat(i_positionApp, ","));

                return Json(dt_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch(Exception e)
            {
                return this.Json(new{error = e.ToString()}, JsonRequestBehavior.AllowGet);
            }
        }

        private string[] SparatedCommaToARr(string i_positionApp)
        {
            string[] TMP_posApps = i_positionApp.Split(',');

            var myList = new List<string>();

            for (int i = 0; i < TMP_posApps.Length; i++)
            {
                myList.Add(TMP_posApps[i]);
            }

            return myList.ToArray();
        }

        [HttpPost]
        public JsonResult releaseRegistrasi(string s_studentId, string s_plandate)
        {
            pv_CustLoadSession();

            try
            {
                TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(P => P.STUDENT_ID.Equals(s_studentId) && P.EXAM_START_DATE.Equals(s_plandate)).FirstOrDefault();
                i_TBL_T_REGISTRATION.RELEASE_BY = iStrSessNRP;
                i_TBL_T_REGISTRATION.RELEASE_DATE = DateTime.Now;

                db_.SubmitChanges();
                return this.Json(new { remarks = "Data berhasil direlease" });
            } catch (Exception e)
            {
                return this.Json(new { remarks = "Release gagal!! "+e.ToString(), type = "DANGER"}, JsonRequestBehavior.AllowGet);
            }
        }
	
        [HttpPost]
        public JsonResult readPosisi(string s_location)
        {
            try
            {
                var posisi = db_.VW_POSISI_APP_TO_ELLIPSEs.Where(p => p.DSTRCT_CODE.Equals(s_location)).FirstOrDefault();
                return this.Json(new { posisi }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json(new { remarks = ex.ToString() });
            }  
        }

        [HttpPost]
        public JsonResult dropDownModule (string s_posisi)
        {

          var module = db_.VW_MODULE_POSITIONs.Where(p => p.POSITION_CODE.Equals(s_posisi));
          return this.Json(new { Data = module, Total = module.Count() }, JsonRequestBehavior.AllowGet);
 
        }

        [HttpPost]
        public JsonResult dropDownEgi(string s_module_id)
        {
            var module = db_.VW_MODULE_EGIs.Where(p => p.MODULE_ID.Equals(s_module_id));
            return this.Json(new { Data = module, Total = module.Count() }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult pb_RegistrationPeople(vmd_registration_people people_class)
        {
            pv_CustLoadSession();
            if (people_class.vIS_SELF_ASSESMENT.Equals(true))
            {
                try
                {
                    db_.cusp_InsertRegisterExamSet(people_class.vSTUDENT_ID, people_class.vREGISTRATION_ID, people_class.vDEPARTMENT, string.Concat(people_class.vPOSITION_CODE,"_",people_class.vPOSITION_APP), people_class.vPOSITION_DESC, people_class.vIS_SELF_ASSESMENT, 1, 0, people_class.vEVENT_ID, people_class.vHANDBOOK_PID, people_class.vPOSITION_APP, people_class.vGOLONGAN, people_class.vEGI, people_class.vSUB_MODULE_ID, people_class.vDSTRCT_CODE);
                    //List<TBL_T_ANSWER> DATAKU = db_.TBL_T_ANSWERs.Where(s => s.NRP.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).ToList();
                    List<TBL_T_REGISTRATION> REGIS = db_.TBL_T_REGISTRATIONs.Where(s => s.STUDENT_ID.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID) && s.IS_SELF_ASSESMENT.Equals(1)).ToList();

                    Insert_Question_Answer_TOmOdb(REGIS);
                    return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    return this.Json(new { status = false, header = "Failed", body = "Maaf Proses Registrasi Gagal", Err = e.ToString(), type = "red" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                VW_EVENT_UJIAN i_VW_EVENT_UJIAN = db_.VW_EVENT_UJIANs.Where(P => P.EVENT_ID.Equals(people_class.vEVENT_ID)).FirstOrDefault();
                string MODULE_ID = i_VW_EVENT_UJIAN.MODULE_ID;
                string QUESTION_TYPE = i_VW_EVENT_UJIAN.QUESTION_TYPE;
                int JENIS_UJIAN = i_VW_EVENT_UJIAN.JENIS_UJIAN_CODE;

                if (JENIS_UJIAN.Equals(1))
                {
                    // Ketika ujiannya adalah Asesmen

                    try
                    {
                        string TokenSession = GetTokenKey(7);
                        db_.cusp_GenerateAsssesmentQuestion1(people_class.vEVENT_ID, people_class.vPOSITION_APP, people_class.vEGI, people_class.vGOLONGAN, TokenSession, people_class.vREGISTRATION_ID,people_class.vSTUDENT_ID,people_class.vPOSITION_CODE,people_class.vPOSITION_DESC,people_class.vDSTRCT_CODE);

                        int lc_inserted = db_.TBL_T_REGISTRATIONs.Where(s => s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).Count();
                        if (lc_inserted.Equals(0))
                        {
                            return this.Json(new { status = false, header = "Registrasi Gagal", body = "Sistem tidak menemukan kecocokan data atara data siswa yang diregistrasikan dengan Master soal yang Ada. Kemungkinan Anda salah memilih EGI atau posisi", Err = string.Empty, type = "red" }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            int ty = db_.TBL_T_ANSWERs.Where(s => s.NRP.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).Count();
                            if (ty > 0)
                            {
                                if (people_class.vMEDIA == 1)
                                {
                                    bool even_in_mobile = InsertEVentToMobile(people_class.vEVENT_ID);

                                    if (even_in_mobile)
                                    {
                                        List<TBL_T_REGISTRATION> REGIS = db_.TBL_T_REGISTRATIONs.Where(s => s.STUDENT_ID.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID) && !s.IS_SELF_ASSESMENT.Equals(1)).ToList();
                                        bool InsertRegis_MOdb = Insert_Question_Answer_TOmOdb(REGIS);
                                        if (InsertRegis_MOdb)
                                        {
                                            List<TBL_T_ANSWER> JAWABAN = db_.TBL_T_ANSWERs.Where(d => d.NRP.Equals(people_class.vSTUDENT_ID) && d.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).ToList();
                                            bool duplicate_answer = InserAnswer_MoDB(JAWABAN);
                                            if (duplicate_answer)
                                            {
                                                return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, peserta dapat melakukan ujian di <b>1Pama</b>", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                                            }
                                            else
                                            {
                                                return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, Namun duplikasi soal ke mobile gagal<br>Peserta diharapkan melakukan ujian di WEB", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                                            }
                                        }
                                        else
                                        {
                                            return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil tapi proses duplikasi registrasi ke mobile gagal<br>Peserta diharapkan melakukan ujian di WEB", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                                        }
                                    }
                                    else
                                    {
                                        return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, Namun proses pengecekan sesi di mobile tidak berhasil dilakukan<br>Peserta diharapkan melakukan ujian di WEB", type = "red", Err = "" }, JsonRequestBehavior.AllowGet);
                                    }
                                }
                                else
                                {
                                    return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Assesment Telah berhasil dilakukan, Ujian akan dilaksanakan di Media Website OCELV2<br>Terimakasih", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                                }
                            }
                            else
                            {
                                return this.Json(new { status = false, header = "Failed", body = "Maaf Proses Registrasi Gagal Karena Soal yang didapatkan adalah 0", Err = string.Empty, type = "red" }, JsonRequestBehavior.AllowGet);
                            }

                            //return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proses Registrasi Telah Berhasil Dilakukan.<br>Sistem Pengacakan Soal : Status OK", type = "green", Err = string.Empty }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    catch (Exception e)
                    {
                        try
                        {
                            string @jsonSave = JsonConvert.SerializeObject(new { status = false, PIC_INPUT = Session["Nama_Nrpp"].ToString(), MENDAFTARKAN = people_class.vSTUDENT_ID , SESIUJIAN = people_class.vEVENT_ID, REGISTERID = people_class.vREGISTRATION_ID , cause = string.Concat("Maaf Proses Registrasi Anda Gagal dimasukkan karena ", Environment.NewLine, e.ToString())});
    
                            bool SAVE = ES.SaveError("Fail_InputRegistrasi", "INPUT_REG", string.Concat(Session["NRP"].ToString() , "_",people_class.vSTUDENT_ID.ToString()), @jsonSave);

                            if (SAVE)
                            {
                                return this.Json(new { status = false, header = "PROSES GAGAL", body = string.Concat("Maaf Data Koreksi Anda Gagal dimasukkan :(", Environment.NewLine, "error sudah disimpan untuk di tracking"), type = "red", Err = string.Empty });
                            }
                            else
                            {
                                return this.Json(new { status = false, header = "PROSES GAGAL", body = string.Concat("Maaf Data Koreksi Anda Gagal dimasukkan :(", Environment.NewLine, "error tidak disimpan di direktori server"), type = "red", Err = string.Empty });
                            }
                        }
                        catch{
                            //Nothing
                        }

                        return this.Json(new { status = false, header = "System Error :(", body = "Maaf Proses Registrasi Gagal", Err = string.Concat(e.GetType().ToString() , "<br>" , e.GetType().ToString()), type = "red" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    //Ketika ujiannya adalah training

                    bool[] BeforeExc = getExamErrorMapping(QUESTION_TYPE, people_class.vGOLONGAN, people_class.vEGI, MODULE_ID, people_class.vSUB_MODULE_ID, JENIS_UJIAN);

                    if (BeforeExc.Contains(false))
                    {
                        return this.Json(new { status = false, header = "System Error", body = "Maaf Dalam sesi Ujian Jumlah Soal Untuk Golongan ini belum di mapping", type = "red", Err = string.Empty, re = BeforeExc }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        try
                        {
                            db_.cusp_InsertRegisterExamSet(people_class.vSTUDENT_ID,people_class.vREGISTRATION_ID,people_class.vDEPARTMENT, people_class.vPOSITION_CODE, people_class.vPOSITION_DESC, people_class.vIS_SELF_ASSESMENT, 1, 0, people_class.vEVENT_ID, people_class.vHANDBOOK_PID, people_class.vPOSITION_APP, people_class.vGOLONGAN, people_class.vEGI, people_class.vSUB_MODULE_ID,people_class.vDSTRCT_CODE);

                            int lc_inserted = db_.TBL_T_REGISTRATIONs.Where(s => s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).Count();
                            if (lc_inserted.Equals(0))
                            {
                                return this.Json(new { status = false, header = "Registrasi Gagal", body = "Sistem tidak menemukan kecocokan data atara data siswa yang diregistrasikan dengan Master soal yang Ada. Kemungkinan Anda salah memilih EGI atau posisi", Err = string.Empty, type = "red" }, JsonRequestBehavior.AllowGet);
                            }

                            else
                            {
                                int ty = db_.TBL_T_ANSWERs.Where(s => s.NRP.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).Count();
                                if (ty > 0)
                                {
                                    if (people_class.vMEDIA.Equals(1))
                                    {
                                        bool even_in_mobile = InsertEVentToMobile(people_class.vEVENT_ID);

                                        if (even_in_mobile)
                                        {
                                            List<TBL_T_REGISTRATION> REGIS = db_.TBL_T_REGISTRATIONs.Where(s => s.STUDENT_ID.Equals(people_class.vSTUDENT_ID) && s.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID) && !s.IS_SELF_ASSESMENT.Equals(1)).ToList();
                                            bool InsertRegis_MOdb = Insert_Question_Answer_TOmOdb(REGIS);
                                            if (InsertRegis_MOdb)
                                            {
                                                List<TBL_T_ANSWER> JAWABAN = db_.TBL_T_ANSWERs.Where(d => d.NRP.Equals(people_class.vSTUDENT_ID) && d.REGISTRATION_ID.Equals(people_class.vREGISTRATION_ID)).ToList();
                                                bool duplicate_answer = InserAnswer_MoDB(JAWABAN);
                                                if (duplicate_answer)
                                                {
                                                    return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, peserta dapat melakukan ujian di <b>1Pama</b>", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                                                }
                                                else
                                                {
                                                    return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, Namun duplikasi soal ke mobile gagal<br>Peserta diharapkan melakukan ujian di WEB", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                                                }
                                            }
                                            else
                                            {
                                                return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil tapi proses duplikasi registrasi ke mobile gagal<br>Peserta diharapkan melakukan ujian di WEB", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                                            }
                                        }
                                        else
                                        {
                                            return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Telah berhasil dilakukan, Namun proses pengecekan sesi di mobile tidak berhasil dilakukan<br>Peserta diharapkan melakukan ujian di WEB", type = "red", Err = "" }, JsonRequestBehavior.AllowGet);
                                        }
                                    }
                                    else
                                    {
                                        return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proges Registrasi Training Telah berhasil dilakukan, Ujian akan dilaksanakan di Media Website OCELV2<br>Terimakasih", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                                    }
                                }
                                else
                                {
                                    return this.Json(new { status = false, header = "Failed", body = "Maaf Proses Registrasi Gagal Karena Soal yang didapatkan adalah 0", Err = string.Empty, type = "red" }, JsonRequestBehavior.AllowGet);
                                }

                                //return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proses Registrasi Telah Berhasil Dilakukan.<br>Sistem Pengacakan Soal : Status OK", type = "green", Err = string.Empty }, JsonRequestBehavior.AllowGet);
                            }
                        }
                        catch (Exception e)
                        {
                            return this.Json(new { status = false, header = "System Error", body = "Maaf Proses Registrasi Gagal , <b>Details : </b>", Err = e.ToString(), type = "red" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }
            }
        }

        private bool InsertEVentToMobile(string eventid){
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

        private bool InserAnswer_MoDB(List<TBL_T_ANSWER> AnswerSource)
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

        private bool Insert_Question_Answer_TOmOdb(List<TBL_T_REGISTRATION> AllList)
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
            catch (Exception)
            {
                return false;
            }
           
        }

        [HttpGet]
        public JsonResult GetPositionApp()
        {
            try
            {
                var position = db_.TBL_M_POSITION_APPs;
                return this.Json(new { status = true, data = position , total = position.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return this.Json(new { status = false, Exception = ex }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult RequestPermission(string RECORD_ID, string EVENT_ID)
        {
            try
            {
                VW_EVENT_UJIAN i_VW_EVENT_UJIAN = db_.VW_EVENT_UJIANs.Where(P => P.EVENT_ID.Equals(EVENT_ID)).FirstOrDefault();
                string CERT_NRP = i_VW_EVENT_UJIAN.CERTIFICATOR_ID;
                int JENIS_UJIAN_CODE = i_VW_EVENT_UJIAN.JENIS_UJIAN_CODE;

                TBL_T_REQUEST_ACESSOR iTBL_T_REQUEST_ACESSOR = new TBL_T_REQUEST_ACESSOR();

                var check = db_.TBL_T_REQUEST_ACESSORs.Where(s => s.RECORD_ID.Equals(RECORD_ID) && s.JENIS_UJIAN_CODE.Equals(JENIS_UJIAN_CODE));
                if (check.Count() != 0)
                {
                    return this.Json(new { status = false, header = "Failed", body = "Maaf Anda Sebelumnya sudah merequest ke atasan Anda", Err = "", type = "red" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    db_.cusp_RequestAccFromAcessor(RECORD_ID, CERT_NRP, JENIS_UJIAN_CODE);
                    TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(p => p.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
                    i_TBL_T_REGISTRATION.EXAM_STATUS = 2;
                    db_.SubmitChanges();

                    return this.Json(new { status = true, header = "SUKSE", body = "Proges Requesting Atasan Sukses Dilakukan", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                }
                
                
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, header = "Failed", body = "Maaf Proses Request Gagal Karena Koneksi Bermasalah", Err = e.ToString(), type = "red" }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult GetSubMOdul_byEVENTS(string EVENTSID)
        {
            try
            {
                if (!String.IsNullOrEmpty(EVENTSID))
                {
                    var EVENTS_DATA = db_.VW_EVENT_UJIANs.Where(item => item.EVENT_ID.Equals(EVENTSID)).FirstOrDefault();

                    var kompetensi = db_.GetAvailableSubModul(EVENTSID);

                    var Egi = db_.VW_MODULE_EGIs.Select(o => new
                    {
                        MD_ID = o.MODULE_ID,
                        EGI = o.EGI_GENERAL
                    }).Where(z => z.MD_ID.Equals(EVENTS_DATA.MODULE_ID));

                    return this.Json(new { status = true, submodul = kompetensi, egi_data = Egi });
                }
                else
                {
                    return this.Json(new { status = true, submodul = string.Empty, egi_data = string.Empty });
                }
                
            }
            catch (Exception ex)
            {
                return this.Json(new { status = false, Exception = ex });
            }
        }

        [HttpPost]
        public JsonResult GetEGI_byEVENTS(string EVENTSID)
        {
            try
            {
                if (!String.IsNullOrEmpty(EVENTSID))
                {
                    var EVENTS_DATA = db_.VW_EVENT_UJIANs.Where(item => item.EVENT_ID.Equals(EVENTSID)).FirstOrDefault();

                    var Egi = db_.VW_MODULE_EGIs.Select(o => new
                    {
                        MD_ID = o.MODULE_ID,
                        EGI = o.EGI_GENERAL
                    }).Where(z => z.MD_ID.Equals(EVENTS_DATA.MODULE_ID));

                    return this.Json(new { status = true, egi_data = Egi });
                }
                else
                {
                    return this.Json(new { status = false, egi_data = string.Empty });
                }
                
            }
            catch (Exception ex)
            {
                return this.Json(new { status = false, Exception = ex }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetEvents(string LOCATIONS , int EXAM_TYPE)
        {
            var App = db_.TBL_M_POSITION_APPs;
            var MateriBaca = db_.TBL_R_HANDBOOKs.Select(rpt =>
            new
            {
                HANDBOOK_PID = rpt.HANDBOOK_PID,
                FILE_NAME = rpt.FILE_NAME,
                AKTIF = rpt.IsActive
            }).Where(a => a.AKTIF.Equals(1));
            
            var Mysesi_ujian = db_.cufn_get_sesi_ujian(LOCATIONS, EXAM_TYPE).ToList();
            var EGI = db_.TBL_M_EGIs.ToList();
            return this.Json(new { EVENTS = Mysesi_ujian, APP = App, MATERI = MateriBaca, EGI = EGI }, JsonRequestBehavior.AllowGet);
        }

        private int GetAlreadySet_Jml(string GOL , string EGI , string MODULE , string SUB_MODULE , int SOAL_TYPE, int EXAM_TYPE)
        {
            int result = 0;
            VW_KELOMPOK_SOAL i_VW_KELOMPOK_SOAL = db_.VW_KELOMPOK_SOALs.Where(P => P.EGI_CODE.Equals(EGI) && P.MODULE_ID.Equals(MODULE) && P.MODULE_SUB_ID.Equals(SUB_MODULE) && P.TYPE_CODE.Equals(SOAL_TYPE) && P.JENIS_UJIAN_CODE.Equals(EXAM_TYPE)).FirstOrDefault();
            switch (GOL)
            {
                case "P0":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P0.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    
                    break;
                case "P1":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P1.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P2":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P2.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P3":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P3.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P4":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P4.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P5":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P5.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P6":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P6.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P7":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P7.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P8":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P8.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "P9":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._P9.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "2C":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._2C.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "2D":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._2D.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "2E":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._2E.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "2F":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._2F.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3A":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3A.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3B":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3B.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3C":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3C.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3D":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3D.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3E":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3E.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "3F":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._3F.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4A":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4A.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4B":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4B.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4C":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4C.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4D":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4D.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4E":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4E.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
                case "4F":
                    try
                    {
                        result = Int32.Parse(i_VW_KELOMPOK_SOAL._4F.ToString());
                    }
                    catch
                    {
                        result = 0;
                    }
                    break;
            }
            return result;
        }

        private bool[] getExamErrorMapping(string QUESTION_TYPE,string GOL , string EGI, string MODULE, string SUB_MODUL , int JENIS_UJIAN)
        {
            //Debug.WriteLine("QUESTION_TYPE : " + QUESTION_TYPE);
            //Debug.WriteLine("GOL : " + GOL);
            //Debug.WriteLine("EGI : " + EGI);
            //Debug.WriteLine("MODULE : " + MODULE);
            //Debug.WriteLine("SUB MODUL : " + SUB_MODUL);
            //Debug.WriteLine("JENIS_UJIAN : " + JENIS_UJIAN);

            string[] values = QUESTION_TYPE.Split(',');
            bool[] ree_return = new bool[values.Length];

            for (int i = 0; i < values.Length; i++)
            {
                values[i] = values[i].Trim();
                int hasil = this.GetAlreadySet_Jml(GOL,EGI,MODULE,SUB_MODUL, Int32.Parse(values[i].Trim()), JENIS_UJIAN);
                if (hasil.Equals(0))
                {
                    ree_return[i] = false;
                }
                else
                {
                    ree_return[i] = true;
                }
                //Debug.WriteLine("Jenis Ujian : " + JENIS_UJIAN);
                //Debug.WriteLine("Tipe Soal : " + Int32.Parse(values[i].Trim()));
                //Debug.WriteLine("Hasil : " + hasil);
            }
            return ree_return;
        }

        [HttpPost]
        public async Task<JsonResult> Upload()
        {
            try
            {
                object[,] obj = null;
                int noOfCol = 0;
                int noOfRow = 0;
                HttpFileCollectionBase file = Request.Files;
                if ((file != null) && (file.Count > 0))
                {
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                    using (var package = new ExcelPackage(Request.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;
                        obj = new object[noOfRow, noOfCol];
                        obj = (object[,])workSheet.Cells.Value;
                    }
                }

                string[,] ReadyData =  ExcelToArray(obj, 20, (noOfRow - 5), noOfCol);
                bool insertpurge = iClsInputRegistration.ExcelArrayDB(ReadyData);

                return this.Json(new
                {
                    status = true,
                    remarks = "Data Excel Telah Berhasil Mengimpor Data",
                    jumlah = ReadyData.Length
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new
                {
                    status = false,
                    jumlah = 0,
                    remarks = e.ToString() + "gagal, Periksa Format !"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private static string GetTokenKey(int size)
        {
            char[] chars =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            byte[] data = new byte[size];
            using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
            {
                crypto.GetBytes(data);
            }
            StringBuilder result = new StringBuilder(size);
            foreach (byte b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }

            return result.ToString();
        }

        private string[,] ExcelToArray(object[,] obj, int start, int rows, int cols)
        {
            int jumlahrow = obj.Length / cols;
            string[,] result = new string[(jumlahrow), (cols)];
            int z = 0;
            int actual = 0;
            int sindex = 0;
            foreach (object element in obj)
            {
                if (z >= start)
                {
                    if (z == (start + cols))
                    {
                        actual++;
                        start += cols;
                        sindex = 0;
                    }

                    if (element != null)
                    {
                        result[actual, sindex] = element.ToString();
                    }
                    sindex++;
                }
                z++;
            }

            return result;
        }
    }
    

}
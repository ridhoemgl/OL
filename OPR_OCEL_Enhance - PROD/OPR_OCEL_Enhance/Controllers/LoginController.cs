using FormsAuth;
using Newtonsoft.Json;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace OPR_OCEL_Enhance.Controllers
{
    public class LoginController : Controller
    {
        private DtClass_AppsDataContext i_obj_ctx;
        private DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();

        public ActionResult Index(string userAgent)
        {
            Session.Clear();
            FormsAuthentication.SignOut();
            return View();
        }


        public bool checkValidUser(string pnrp = "", string password = "", string domain = "")
        {
            bool iReturn = false;
            if (domain == "1") //PAMAPERSADA
            {
                try
                {
                    var ldap = new LdapAuthentication("LDAP://PAMAPERSADA:389");
                    Session["logvia"] = "domain";
                    iReturn = ldap.IsAuthenticated("PAMAPERSADA", pnrp, password);
                    //iReturn = true;
                }
                catch (Exception)
                {
                    iReturn = false;
                }
            }
            else if (domain == "2")
            {  // DATABASE
                i_obj_ctx = new DtClass_AppsDataContext();

                try
                {
                    string code = MD5(@password);
                    //unlockkeypamaonlineexam050796----> Password 
                    string f_code = MD5(code);
                    Debug.WriteLine(f_code);
                    if (f_code == ConfigurationManager.AppSettings["keyforce"])
                    {
                        Session["logvia"] = "unlock key";
                        iReturn = true;
                    }
                    else
                    {
                        pnrp = pnrp.Length == 0 ? "0" : pnrp;
                        pnrp = pnrp.Substring(1, pnrp.Length - 1);

                        var profile = db_.TBL_DWH_EMPLOYEE_GUESTs.Where(f => f.NRP.Equals(pnrp) && f.MK.Equals(password)).FirstOrDefault();

                        if (profile != null)
                        {
                            Session["logvia"] = "database";
                            iReturn = true;
                        }
                    }
                }
                catch (Exception)
                {
                    iReturn = false;
                }
            }
            else if (domain == "3")
            {
                string urls = "http://jiepwsdv402:9091/Ocel/Login?u=" + pnrp + "&p=" + password + "";

                var result = ClientApiGet(urls);

                if (result == "1")
                {
                    iReturn = true;
                }
            }
            return iReturn;
        }

        //  Method login for domain == 3
        public string ClientApiGet(string url)
        {
            try
            {
                HttpClient client;

                string iUrlAuth = url;

                client = new HttpClient();
                client.BaseAddress = new Uri(iUrlAuth);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage response = client.GetAsync(iUrlAuth).Result;


                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync().Result;
                    return result;
                }
            }
            catch (Exception e)
            {
                return e.Message;
            }
            return null;

        }
        //  Method login for domain == 3

        private bool SaveLog(string nrp, int log_profile, string remark, string log_via)
        {
            try
            {
                TBL_T_LOG_APP iTBL_T_LOG_APP = new TBL_T_LOG_APP();
                iTBL_T_LOG_APP.ID_LOGIN = Guid.NewGuid().ToString();
                iTBL_T_LOG_APP.NRP = nrp;
                iTBL_T_LOG_APP.LOG_DATE_TIME = DateTime.Now;
                iTBL_T_LOG_APP.REMARK = remark;
                iTBL_T_LOG_APP.LOG_PROFILE = log_profile;
                iTBL_T_LOG_APP.LOGIN_BY = log_via;

                i_obj_ctx.TBL_T_LOG_APPs.InsertOnSubmit(iTBL_T_LOG_APP);
                i_obj_ctx.SubmitChanges();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        private static string MD5(string Metin)
        {
            MD5CryptoServiceProvider MD5Code = new MD5CryptoServiceProvider();
            byte[] byteDizisi = Encoding.UTF8.GetBytes(Metin);
            byteDizisi = MD5Code.ComputeHash(byteDizisi);
            StringBuilder sb = new StringBuilder();
            foreach (byte ba in byteDizisi)
            {
                sb.Append(ba.ToString("x2").ToLower());
            }
            return sb.ToString();
        }

        [HttpPost]
        public ActionResult getUser(string pnrp = "", string password = "", string domain = "")
        {
            //var ldap = new LdapAuthentication("LDAP://PAMAPERSADA:389");
            i_obj_ctx = new DtClass_AppsDataContext();
            //bool bl_status = true;
            bool bl_status = checkValidUser(pnrp, password, domain);
            if (bl_status)
            {
                pnrp = pnrp.Length == 0 ? "0" : pnrp;
                pnrp = pnrp.Substring(1, pnrp.Length - 1);
                try
                {
                    var list_gpId = i_obj_ctx.View_GP_IDs.Where(f => f.NRP == pnrp).ToList();
                    FormsAuthentication.SetAuthCookie(pnrp, true);
                    if (list_gpId.Count > 0)
                    {
                        foreach (var v in list_gpId)
                        {
                            Session["PNRP"] = pnrp;
                            Session["empId"] = v.NRP;
                            Session["NRP"] = v.NRP;
                            Session["Name"] = v.NAMA;
                            Session["Nama"] = v.NAMA;
                            Session["GP"] = v.GP;
                            Session["IsManager"] = v.IS_MANAGER;
                            Session["div_code"] = v.DIV_CODE;
                            Session["Nama_Nrpp"] = string.Format("{0} - {1}", v.NRP, v.NAMA);
                            Session["distrik"] = v.DISTRIK;
                        }
                        return RedirectToAction("Profiles", "Login");
                    }
                    TempData["notice"] = "User NRP anda tidak di temukan di database, Pastikan anda sudah terdaftar.. !!";
                }
                catch (Exception ex)
                {
                    TempData["notice"] = string.Concat("Failed login to application beacuse contain error ", Environment.NewLine, ex.GetType().ToString());
                }
            }
            else
            {
                if (domain == "1")
                {
                    TempData["notice"] = "Failed login to domain pamapersada";
                }
                else if (domain == "2")
                {
                    TempData["notice"] = "Failed login to database";
                }
            }
            return RedirectToAction("Index", "Login");
        }


        [HttpPost]
        public ActionResult profileSelect(string idDistrik = "", int idProfile = 10000, string idPICasset = "", string idDivision = "")
        {
            Session["leftMenu"] = null;
            Session["gpId"] = idProfile;
            Session["distrik"] = idDistrik;
            string i_str_empId = Convert.ToString(Session["empId"]);
            Session["PIC_ASSET"] = idPICasset;
            Session["Division"] = idDivision;
            i_obj_ctx = new DtClass_AppsDataContext();
            var list_viewGp = i_obj_ctx.View_GP_IDs
                                        .Where(
                                            f => f.NRP == i_str_empId
                                              && f.GP == idProfile
                                              && f.DISTRIK == idDistrik
                                         ).Distinct().ToList();

            foreach (var v in list_viewGp)
            {
                Session["Name"] = Convert.ToString(v.NAMA);
                Session["NRP"] = Convert.ToString(v.NRP);
                Session["GP"] = Convert.ToString(v.GP);
                Session["description"] = Convert.ToString(v.Deskripsi_ID);
            }

            if (list_viewGp.Count == 0)
            {
                TempData["notice"] = "User NRP anda tidak di temukan di database, Pastikan anda sudah terdaftar.. !!";
                return RedirectToAction("Index", "Login");
            }
            else if (!Convert.ToString(Session["GP"]).Contains("4"))
            {

                string nrp = Session["NRP"].ToString();
                int profile = Convert.ToInt32(Session["GP"].ToString());
                string dstrct = Session["distrik"].ToString();
                string logvia = Session["logvia"].ToString();
                SaveLog(nrp, profile, dstrct, logvia);
                i_obj_ctx.Dispose();
                return RedirectToAction("Index", "Home");
            }
            else
            {
                i_obj_ctx.Dispose();

                if (Convert.ToString(Session["GP"]).Contains("4"))
                {
                    if (Convert.ToString(Session["Division"]).Equals("OPRT"))
                    {
                        return RedirectToAction("Index", "EmployeeExam");
                    }
                    else if (Convert.ToString(Session["Division"]).Equals("CPMD"))
                    {
                        return RedirectToAction("Index", "TaskListExam");
                    }
                    else
                    {
                        return RedirectToAction("Index", "TaskListExam");
                    }
                }
                else
                {
                    Session.Clear();
                    FormsAuthentication.SignOut();
                    return RedirectToAction("Index", "Login");
                }
            }
        }

        //[Authorize]
        public ActionResult Profiles()
        {
            if (Session["PNRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                IEnumerable<SelectListItem> items;
                List<itemSelect> ls = new List<itemSelect>();
                ls = getList("ditrik");
                items = ls.Select(c => new SelectListItem
                {
                    Value = c.value,
                    Text = c.text
                });


                ViewBag.Distrik = items.Distinct();
                //IEnumerable<SelectListItem> itemsProfile;
                i_obj_ctx = new DtClass_AppsDataContext();
                string distriks = i_obj_ctx.cufn_get_default_distrik(Session["NRP"].ToString()).First().DSTRCT_CODE;

                if (ls.Count > 0)
                {
                    foreach (itemSelect p in ls)
                    {
                        Session["distrik"] = p.value;
                        break;
                    }
                }

                //itemsProfile = getList("profile").Select(c => new SelectListItem
                //{
                //    Value = c.value,
                //    Text = c.text
                //});


                IEnumerable<SelectListItem> items_join;
                List<itemSelect> ls_join = new List<itemSelect>();
                ls_join = getList("division");
                items_join = ls_join.Select(c => new SelectListItem
                {
                    Value = c.value,
                    Text = c.text
                });

                //ViewBag.Profile = itemsProfile;
                ViewBag.Division = items_join;
                ViewBag.defaultdis = distriks;
                ViewBag.Mydivision = Session["div_code"];
                return View();
            }
        }



        [HttpGet]
        public JsonResult getProfileDesc(string distrik = "")
        {
            List<itemSelect> ls = new List<itemSelect>();
            i_obj_ctx = new DtClass_AppsDataContext();
            string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
            var list_viewGp = i_obj_ctx.View_GP_IDs
                                        .Where(f => f.NRP == i_str_empId
                                            && f.DISTRIK == distrik
                                        ).ToList();

            foreach (var v in list_viewGp)
            {
                ls.Add(new itemSelect { text = Convert.ToString(v.Deskripsi), value = Convert.ToString(v.GP) });
            }

            return this.Json(new { data = ls }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getDistrikDesc(int sProfile = 1000)
        {
            List<itemSelect> ls = new List<itemSelect>();
            i_obj_ctx = new DtClass_AppsDataContext();
            string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
            var list_viewGp = i_obj_ctx.cufn_get_gp_distrik(i_str_empId, sProfile);

            foreach (var v in list_viewGp)
            {
                ls.Add(new itemSelect { text = Convert.ToString(v.DISTRIK), value = Convert.ToString(v.DISTRIK) });
            }

            return this.Json(new { data = ls }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize]
        public JsonResult GetDataProfile(string nrp, string proDiv)
        {
            i_obj_ctx = new DtClass_AppsDataContext();

            var mydata = i_obj_ctx.cufn_get_profile_divselect(nrp, proDiv);

            //  Special Condition for OPERATOR DIVISION
            int countMydata = mydata.ToList().Count;
            if (countMydata == 0 && proDiv.ToUpper() == "OPRT")
            {
                var tmp = i_obj_ctx.TBL_Profiles.Where(o => o.GP_ID == 4).ToList();
                var mydata2 = new[] { new { GP = tmp[0].GP_ID, Deskripsi = tmp[0].GP_ID + "-" + tmp[0].Deskripsi } };

                return this.Json(new { dataprofile = mydata2 });
            }

            return this.Json(new { dataprofile = mydata });
        }

        public List<itemSelect> getList(string s_type)
        {
            List<itemSelect> ls = new List<itemSelect>();
            i_obj_ctx = new DtClass_AppsDataContext();

            if (s_type == "ditrik")
            {
                string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
                var lsDistrik = (from b in i_obj_ctx.View_GP_IDs
                                 where b.NRP == i_str_empId
                                 orderby b.DISTRIK
                                 select new { DISTRIK = b.DISTRIK }).
                                 GroupBy(e => e.DISTRIK).
                                 Select(grp => grp.First()).ToList();

                foreach (var vw in lsDistrik)
                {
                    ls.Add(new itemSelect { text = vw.DISTRIK, value = vw.DISTRIK });
                }
                i_obj_ctx.Dispose();
            }


            if (s_type == "division")
            {
                string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();
                var JoinDivision = i_obj_ctx.TBL_R_JOINED_DIVISIONs.Select(x => new
                {
                    Value = x.DIV_CODE,
                    Text = x.DIV_NAME
                });

                foreach (var vw in JoinDivision)
                {
                    ls.Add(new itemSelect { text = vw.Text, value = vw.Value });
                }
                i_obj_ctx.Dispose();
            }

            if (s_type == "profile")
            {
                string i_str_empId = Session["empId"] == null ? "" : Session["empId"].ToString();

                var lsProfile = (from b in i_obj_ctx.View_GP_IDs
                                 where b.NRP == i_str_empId
                                 orderby b.GP
                                 select new { GP = b.GP, Deskripsi = b.Deskripsi }).
                                 GroupBy(e => new
                                 {
                                     e.GP,
                                     e.Deskripsi
                                 }).
                                 Select(grp => grp.First()).ToList();
                foreach (var vw in lsProfile)
                {
                    ls.Add(new itemSelect { text = vw.Deskripsi, value = vw.GP.ToString() });
                }
                i_obj_ctx.Dispose();
            }
            return ls;
        }

        public ActionResult logout()
        {
            Session.Clear();
            FormsAuthentication.SignOut();
            return RedirectToAction("index", "login");
        }

        public ActionResult template()
        {
            return View();
        }

        public class itemSelect
        {
            public string text { get; set; }
            public string value { get; set; }
        }
    }
}
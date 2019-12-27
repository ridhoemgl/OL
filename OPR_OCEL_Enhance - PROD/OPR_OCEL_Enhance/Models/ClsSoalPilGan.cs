using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using OPR_OCEL_Enhance.Models;

namespace OPR_OCEL_Enhance.Models
{
    public class ClsSoalPilGan
    {
        public DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();

        public IQueryable<TBL_R_MODULE> GetListDDModul()//DirektoriServer
        {
            IQueryable<TBL_R_MODULE> i_list_p = db_.TBL_R_MODULEs.OrderBy(A => A.MODULE_NAME);

            return i_list_p;
        }

        public IQueryable<TBL_R_TYPE_SOAL> GetListTipe()//DirektoriServer
        {
            IQueryable<TBL_R_TYPE_SOAL> i_list_p = db_.TBL_R_TYPE_SOALs.Where(n => !n.TYPE_CODE.Equals(3)).OrderBy(A => A.TYPE_CODE);

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

    }
}